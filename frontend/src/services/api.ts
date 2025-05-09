
import { Campaign, LinkedInProfile, PersonalizedMessageResponse, ApiResponse } from "../types";

// API base URL - in a real app, this would be an environment variable
const API_BASE_URL = "http://localhost:3000";

// Mock data for development
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Tech Startups Outreach",
    description: "Reaching out to tech startup founders in San Francisco",
    status: "ACTIVE",
    leads: ["https://linkedin.com/in/profile-1", "https://linkedin.com/in/profile-2"],
    accountIDs: ["acc123", "acc456"]
  },
  {
    id: "2",
    name: "Marketing Managers Campaign",
    description: "Targeting senior marketing managers in eCommerce",
    status: "INACTIVE",
    leads: ["https://linkedin.com/in/profile-3"],
    accountIDs: ["acc789"]
  },
  {
    id: "3",
    name: "Sales Leaders Outreach",
    description: "Connecting with VP Sales and Sales Directors",
    status: "ACTIVE",
    leads: ["https://linkedin.com/in/profile-4", "https://linkedin.com/in/profile-5"],
    accountIDs: ["acc123"]
  }
];

// Campaign APIs
export const getCampaigns = async (): Promise<ApiResponse<Campaign[]>> => {
  // In a real app, this would be a fetch call
  // return fetch(`${API_BASE_URL}/campaigns`).then(res => res.json());

  // For development, return mock data
  return {
    data: mockCampaigns.filter(campaign => campaign.status !== "DELETED")
  };
};

export const getCampaignById = async (id: string): Promise<ApiResponse<Campaign>> => {
  // In a real app: return fetch(`${API_BASE_URL}/campaigns/${id}`).then(res => res.json());

  const campaign = mockCampaigns.find(c => c.id === id);
  if (!campaign) {
    return { error: "Campaign not found" };
  }
  return { data: campaign };
};

export const createCampaign = async (campaign: Campaign): Promise<ApiResponse<Campaign>> => {
  // In a real app:
  // return fetch(`${API_BASE_URL}/campaigns`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(campaign)
  // }).then(res => res.json());

  // For development:
  const newCampaign = {
    ...campaign,
    id: String(mockCampaigns.length + 1)
  };
  mockCampaigns.push(newCampaign);
  return { data: newCampaign, message: "Campaign created successfully" };
};

export const updateCampaign = async (id: string, campaign: Partial<Campaign>): Promise<ApiResponse<Campaign>> => {
  // In a real app:
  // return fetch(`${API_BASE_URL}/campaigns/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(campaign)
  // }).then(res => res.json());

  // For development:
  const index = mockCampaigns.findIndex(c => c.id === id);
  if (index === -1) {
    return { error: "Campaign not found" };
  }

  mockCampaigns[index] = { ...mockCampaigns[index], ...campaign };
  return { data: mockCampaigns[index], message: "Campaign updated successfully" };
};

export const deleteCampaign = async (id: string): Promise<ApiResponse<void>> => {
  // In a real app:
  // return fetch(`${API_BASE_URL}/campaigns/${id}`, { method: 'DELETE' }).then(res => res.json());

  // For development:
  const index = mockCampaigns.findIndex(c => c.id === id);
  if (index === -1) {
    return { error: "Campaign not found" };
  }

  mockCampaigns[index].status = "DELETED";
  return { message: "Campaign deleted successfully" };
};

// LinkedIn Message API
export const generatePersonalizedMessage = async (profileData: LinkedInProfile): Promise<ApiResponse<PersonalizedMessageResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/personalized-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Error generating personalized message:', error);

    // Fallback if API call fails
    const fallbackMessage = `Hey ${profileData.name}, I noticed you're a ${profileData.job_title} at ${profileData.company}. Our campaign management system could help streamline your outreach efforts. Would you be open to a quick chat?`;

    return {
      data: { message: fallbackMessage },
      error: error instanceof Error ? error.message : 'Failed to connect to the API'
    };
  }
};