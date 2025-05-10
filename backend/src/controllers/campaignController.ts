import { Request, Response } from 'express';
import Campaign, { CampaignStatus } from '../models/Campaign';
import mongoose from 'mongoose';

// Get all campaigns (excluding DELETED)
export const getCampaigns = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Find all campaigns that are not deleted
    const campaigns = await Campaign.find({ status: { $ne: CampaignStatus.DELETED } });
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error in getCampaigns:', error);
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

    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid campaign ID format' });
      return;
    }

    // Find campaign by ID and ensure it's not deleted
    const campaign = await Campaign.findOne({
      _id: id,
      status: { $ne: CampaignStatus.DELETED }
    });

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error in getCampaignById:', error);
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

    // Validate required fields
    if (!name || !description) {
      res.status(400).json({ message: 'Name and description are required' });
      return;
    }

    // Validate status if provided
    if (status && !Object.values(CampaignStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    // Convert string accountIDs to ObjectIds if provided
    let objectIdAccountIDs: mongoose.Types.ObjectId[] = [];
    if (accountIDs && Array.isArray(accountIDs)) {
      objectIdAccountIDs = accountIDs
        .filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id.toString()));
    }

    // Create new campaign
    const newCampaign = new Campaign({
      name,
      description,
      status: status || CampaignStatus.ACTIVE,
      leads: leads || [],
      accountIDs: objectIdAccountIDs
    });

    // Save to database
    await newCampaign.save();

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error('Error in createCampaign:', error);
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

    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid campaign ID format' });
      return;
    }

    // Validate status if provided
    if (status && !Object.values(CampaignStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid status value' });
      return;
    }

    // Ensure status is only ACTIVE or INACTIVE (not DELETED)
    if (status && status === CampaignStatus.DELETED) {
      res.status(400).json({ message: 'Cannot set status to DELETED directly' });
      return;
    }

    // Find campaign by ID and ensure it's not deleted
    const campaign = await Campaign.findOne({
      _id: id,
      status: { $ne: CampaignStatus.DELETED }
    });

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    // Convert string accountIDs to ObjectIds if provided
    let objectIdAccountIDs: mongoose.Types.ObjectId[] | undefined;
    if (accountIDs && Array.isArray(accountIDs)) {
      objectIdAccountIDs = accountIDs
        .filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id.toString()));
    }

    // Update campaign
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(status && { status }),
          ...(leads && { leads }),
          ...(objectIdAccountIDs && { accountIDs: objectIdAccountIDs })
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error('Error in updateCampaign:', error);
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

    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid campaign ID format' });
      return;
    }

    // Find campaign by ID and ensure it's not already deleted
    const campaign = await Campaign.findOne({
      _id: id,
      status: { $ne: CampaignStatus.DELETED }
    });

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    // Soft delete by setting status to DELETED
    campaign.status = CampaignStatus.DELETED;
    await campaign.save();

    res.status(200).json({
      message: 'Campaign deleted successfully',
      campaign
    });
  } catch (error) {
    console.error('Error in deleteCampaign:', error);
    res.status(500).json({
      message: 'Error deleting campaign',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
