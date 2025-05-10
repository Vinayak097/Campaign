
import type { Campaign, LinkedInProfile, PersonalizedMessageResponse, ApiResponse } from "../types";

// API base URL - in a real app, this would be an environment variable
const API_BASE_URL = "http://localhost:3000/api";

// Empty array for campaigns when backend is not available
const fallbackCampaigns: Campaign[] = [];

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
      body: JSON.stringify(profileData)
    });

    const result = await handleApiResponse<PersonalizedMessageResponse>(response);

    if (result.data) {
      return result;
    }

    throw new Error(result.error || "Failed to generate message");
  } catch (error) {
    console.error("Error generating message:", error);

    // Simple fallback message if backend API call fails
    const { name, job_title, company } = profileData;

    // Generate a basic personalized message
    const message = `Hi ${name},

I noticed you're a ${job_title} at ${company}. I'd like to connect to discuss how our campaign management system could help with your outreach efforts.

Would you be open to a quick conversation?

Best regards,
Campaign Management Team`;

    return {
      data: {
        message,
        model: "fallback-template" // Indicate this is a fallback template
      },
      error: "Using fallback template: Backend server is not available or Gemini API call failed"
    };
  }
};