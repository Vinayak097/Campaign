import { Request, Response } from 'express';
import { CampaignStatus } from '../models/Campaign';
import { v4 as uuidv4 } from 'uuid'; // We'll use this for IDs

// In-memory store for campaigns
interface ICampaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const campaigns: ICampaign[] = [];

// Get all campaigns (excluding DELETED)
export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const activeCampaigns = campaigns.filter(c => c.status !== CampaignStatus.DELETED);
    res.status(200).json(activeCampaigns);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching campaigns',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get a single campaign by ID
export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const campaign = campaigns.find(c => c.id === id);

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    if (campaign.status === CampaignStatus.DELETED) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching campaign',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Create a new campaign
export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;

    // Validate status if provided
    if (status && !Object.values(CampaignStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const newCampaign: ICampaign = {
      id: uuidv4(),
      name,
      description,
      status: status || CampaignStatus.ACTIVE,
      leads: leads || [],
      accountIDs: accountIDs || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    campaigns.push(newCampaign);
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(400).json({
      message: 'Error creating campaign',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Update campaign details
export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, status, leads, accountIDs } = req.body;

    // Validate status if provided
    if (status && !Object.values(CampaignStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    const campaignIndex = campaigns.findIndex(c => c.id === id);

    if (campaignIndex === -1) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    if (campaigns[campaignIndex].status === CampaignStatus.DELETED) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    // Update campaign
    const updatedCampaign = {
      ...campaigns[campaignIndex],
      name: name || campaigns[campaignIndex].name,
      description: description || campaigns[campaignIndex].description,
      status: status || campaigns[campaignIndex].status,
      leads: leads || campaigns[campaignIndex].leads,
      accountIDs: accountIDs || campaigns[campaignIndex].accountIDs,
      updatedAt: new Date()
    };

    campaigns[campaignIndex] = updatedCampaign;

    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(400).json({
      message: 'Error updating campaign',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Soft delete a campaign (set status to DELETED)
export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const campaignIndex = campaigns.findIndex(c => c.id === id);

    if (campaignIndex === -1) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    if (campaigns[campaignIndex].status === CampaignStatus.DELETED) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    // Soft delete by setting status to DELETED
    campaigns[campaignIndex].status = CampaignStatus.DELETED;
    campaigns[campaignIndex].updatedAt = new Date();

    res.status(200).json({
      message: 'Campaign deleted successfully',
      campaign: campaigns[campaignIndex]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting campaign',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
