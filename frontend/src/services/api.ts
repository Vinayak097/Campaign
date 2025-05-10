
import type { Campaign, LinkedInProfile, PersonalizedMessageResponse, ApiResponse } from "../types";

// API base URL - in a real app, this would be an environment variable
const API_BASE_URL = "http://localhost:3000/api";

// Fallback data in case the backend is not available
const fallbackCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Tech Startups Outreach",
    description: "Reaching out to tech startup founders in San Francisco",
    status: "active",
    leads: ["https://linkedin.com/in/profile-1", "https://linkedin.com/in/profile-2"],
    accountIDs: ["acc123", "acc456"]
  },
  {
    id: "2",
    name: "Marketing Managers Campaign",
    description: "Targeting senior marketing managers in eCommerce",
    status: "active",
    leads: ["https://linkedin.com/in/profile-3"],
    accountIDs: ["acc789"]
  },
  {
    id: "3",
    name: "Sales Leaders Outreach",
    description: "Connecting with VP Sales and Sales Directors",
    status: "active",
    leads: ["https://linkedin.com/in/profile-4", "https://linkedin.com/in/profile-5"],
    accountIDs: ["acc123"]
  }
];

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      error: errorData.message || `Error: ${response.status} ${response.statusText}`
    };
  }

  const data = await response.json();
  return { data };
};

// Campaign APIs
export const getCampaigns = async (): Promise<ApiResponse<Campaign[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns`);
    return await handleApiResponse<Campaign[]>(response);
  } catch (error) {
    console.error("Error fetching campaigns:", error);


    return {
      data: fallbackCampaigns.filter(campaign => campaign.status !== "deleted"),
      error: "Using fallback data: Backend server is not available"
    };
  }
};

export const getCampaignById = async (id: string): Promise<ApiResponse<Campaign>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);
    return await handleApiResponse<Campaign>(response);
  } catch (error) {
    console.error("Error fetching campaign:", error);

    // Fallback to local data if backend is not available
    const campaign = fallbackCampaigns.find(c => c.id === id);
    if (!campaign) {
      return { error: "Campaign not found" };
    }

    return {
      data: campaign,
      error: "Using fallback data: Backend server is not available"
    };
  }
};

export const createCampaign = async (campaign: Campaign): Promise<ApiResponse<Campaign>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });

    const result = await handleApiResponse<Campaign>(response);

    if (result.data) {
      return {
        data: result.data,
        message: "Campaign created successfully"
      };
    }

    return result;
  } catch (error) {
    console.error("Error creating campaign:", error);

    // Fallback behavior if backend is not available
    const newCampaign = {
      ...campaign,
      id: String(Date.now()) // Generate a unique ID
    };

    fallbackCampaigns.push(newCampaign);

    return {
      data: newCampaign,
      message: "Campaign created successfully (using fallback storage)",
      error: "Backend server is not available"
    };
  }
};

export const updateCampaign = async (id: string, campaign: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaign)
    });

    const result = await handleApiResponse<Campaign>(response);

    if (result.data) {
      return {
        data: result.data,
        message: "Campaign updated successfully"
      };
    }

    return result;
  } catch (error) {
    console.error("Error updating campaign:", error);

    // Fallback behavior if backend is not available
    const index = fallbackCampaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return { error: "Campaign not found" };
    }

    fallbackCampaigns[index] = { ...fallbackCampaigns[index], ...campaign };

    return {
      data: fallbackCampaigns[index],
      message: "Campaign updated successfully (using fallback storage)",
      error: "Backend server is not available"
    };
  }
};

export const deleteCampaign = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || `Error: ${response.status} ${response.statusText}` };
    }

    return { message: "Campaign deleted successfully" };
  } catch (error) {
    console.error("Error deleting campaign:", error);

    // Fallback behavior if backend is not available
    const index = fallbackCampaigns.findIndex(c => c.id === id);
    if (index === -1) {
      return { error: "Campaign not found" };
    }

    // Mark as deleted (soft delete)
    fallbackCampaigns[index].status = "deleted";

    return {
      message: "Campaign deleted successfully (using fallback storage)",
      error: "Backend server is not available"
    };
  };
};

// LinkedIn Message API
export const generatePersonalizedMessage = async (profileData: LinkedInProfile): Promise<ApiResponse<PersonalizedMessageResponse>> => {
  try {
    // Call the backend API to generate a personalized message using Gemini
    const response = await fetch(`${API_BASE_URL}/personalized-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileData,

      })
    });

    const result = await handleApiResponse<PersonalizedMessageResponse>(response);

    if (result.data) {
      return result;
    }

    throw new Error(result.error || "Failed to generate message");
  } catch (error) {
    console.error("Error generating message:", error);

    // Fallback if backend API call fails - generate a message locally
    const { name, job_title, company, location, summary } = profileData;

    // Extract industry from summary if possible
    const industryKeywords = [
      "tech", "technology", "software", "IT",
      "healthcare", "medical", "health",
      "finance", "financial", "banking",
      "marketing", "advertising", "media",
      "retail", "ecommerce", "sales",
      "education", "academic", "research"
    ];

    let industry = "your industry";
    for (const keyword of industryKeywords) {
      if (summary.toLowerCase().includes(keyword)) {
        industry = keyword;
        break;
      }
    }

    // Generate a personalized message based on the profile data
    const message = `Hi ${name},

I came across your profile and was impressed by your experience as ${job_title} at ${company}. Your background in ${industry} caught my attention, particularly your work in ${location}.

${summary.includes("leadership") ? "Your leadership experience is exactly what I've been looking for in a connection." : "Your expertise is exactly what I've been looking for in a connection."}

I'm reaching out because our AI-powered campaign management platform has helped several ${industry} professionals streamline their outreach efforts and increase response rates by up to 40%.

Would you be open to a quick 15-minute call next week to discuss how we might be able to help ${company} achieve similar results?

Looking forward to connecting,
[Your Name]`;

    return {
      data: {
        message,
        model: "fallback-template" // Indicate this is a fallback template
      },
      error: "Using fallback template: Backend server is not available or Gemini API call failed"
    };
  }
};