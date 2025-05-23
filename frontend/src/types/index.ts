
export type CampaignStatus = "active" | "inactive" | "deleted";

export interface Campaign {
  _id?: string;
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: string[];
}

export interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export interface PersonalizedMessageResponse {
  message: string;
  model?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}
