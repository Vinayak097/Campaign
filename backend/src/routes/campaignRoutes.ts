import express from 'express';
import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController';

const router = express.Router();

// GET all campaigns
router.get('/', getCampaigns);

// GET a single campaign
router.get('/:id', getCampaignById);

// POST a new campaign
router.post('/', createCampaign);

// PUT update a campaign
router.put('/:id', updateCampaign);

// DELETE a campaign (soft delete)
router.delete('/:id', deleteCampaign);

export default router;
