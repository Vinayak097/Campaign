"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getCampaigns = void 0;
const Campaign_1 = require("../models/Campaign");
const uuid_1 = require("uuid"); // We'll use this for IDs
const campaigns = [];
// Get all campaigns (excluding DELETED)
const getCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activeCampaigns = campaigns.filter(c => c.status !== Campaign_1.CampaignStatus.DELETED);
        res.status(200).json(activeCampaigns);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching campaigns',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.getCampaigns = getCampaigns;
// Get a single campaign by ID
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const campaign = campaigns.find(c => c.id === id);
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        if (campaign.status === Campaign_1.CampaignStatus.DELETED) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        res.status(200).json(campaign);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching campaign',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.getCampaignById = getCampaignById;
// Create a new campaign
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, status, leads, accountIDs } = req.body;
        // Validate status if provided
        if (status && !Object.values(Campaign_1.CampaignStatus).includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }
        const newCampaign = {
            id: (0, uuid_1.v4)(),
            name,
            description,
            status: status || Campaign_1.CampaignStatus.ACTIVE,
            leads: leads || [],
            accountIDs: accountIDs || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        campaigns.push(newCampaign);
        res.status(201).json(newCampaign);
    }
    catch (error) {
        res.status(400).json({
            message: 'Error creating campaign',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.createCampaign = createCampaign;
// Update campaign details
const updateCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, status, leads, accountIDs } = req.body;
        // Validate status if provided
        if (status && !Object.values(Campaign_1.CampaignStatus).includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }
        const campaignIndex = campaigns.findIndex(c => c.id === id);
        if (campaignIndex === -1) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        if (campaigns[campaignIndex].status === Campaign_1.CampaignStatus.DELETED) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        // Update campaign
        const updatedCampaign = Object.assign(Object.assign({}, campaigns[campaignIndex]), { name: name || campaigns[campaignIndex].name, description: description || campaigns[campaignIndex].description, status: status || campaigns[campaignIndex].status, leads: leads || campaigns[campaignIndex].leads, accountIDs: accountIDs || campaigns[campaignIndex].accountIDs, updatedAt: new Date() });
        campaigns[campaignIndex] = updatedCampaign;
        res.status(200).json(updatedCampaign);
    }
    catch (error) {
        res.status(400).json({
            message: 'Error updating campaign',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.updateCampaign = updateCampaign;
// Soft delete a campaign (set status to DELETED)
const deleteCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const campaignIndex = campaigns.findIndex(c => c.id === id);
        if (campaignIndex === -1) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        if (campaigns[campaignIndex].status === Campaign_1.CampaignStatus.DELETED) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        // Soft delete by setting status to DELETED
        campaigns[campaignIndex].status = Campaign_1.CampaignStatus.DELETED;
        campaigns[campaignIndex].updatedAt = new Date();
        res.status(200).json({
            message: 'Campaign deleted successfully',
            campaign: campaigns[campaignIndex]
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error deleting campaign',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.deleteCampaign = deleteCampaign;
