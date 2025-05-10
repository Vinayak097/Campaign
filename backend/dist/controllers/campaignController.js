"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getCampaigns = void 0;
const Campaign_1 = __importStar(require("../models/Campaign"));
const mongoose_1 = __importDefault(require("mongoose"));
// Get all campaigns (excluding DELETED)
const getCampaigns = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all campaigns that are not deleted
        const campaigns = yield Campaign_1.default.find({ status: { $ne: Campaign_1.CampaignStatus.DELETED } });
        res.status(200).json(campaigns);
    }
    catch (error) {
        console.error('Error in getCampaigns:', error);
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
        // Validate if the id is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid campaign ID format' });
            return;
        }
        // Find campaign by ID and ensure it's not deleted
        const campaign = yield Campaign_1.default.findOne({
            _id: id,
            status: { $ne: Campaign_1.CampaignStatus.DELETED }
        });
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        res.status(200).json(campaign);
    }
    catch (error) {
        console.error('Error in getCampaignById:', error);
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
        // Validate required fields
        if (!name || !description) {
            res.status(400).json({ message: 'Name and description are required' });
            return;
        }
        // Validate status if provided
        if (status && !Object.values(Campaign_1.CampaignStatus).includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }
        // Convert string accountIDs to ObjectIds if provided
        let objectIdAccountIDs = [];
        if (accountIDs && Array.isArray(accountIDs)) {
            objectIdAccountIDs = accountIDs
                .filter(id => mongoose_1.default.Types.ObjectId.isValid(id))
                .map(id => new mongoose_1.default.Types.ObjectId(id.toString()));
        }
        // Create new campaign
        const newCampaign = new Campaign_1.default({
            name,
            description,
            status: status || Campaign_1.CampaignStatus.ACTIVE,
            leads: leads || [],
            accountIDs: objectIdAccountIDs
        });
        // Save to database
        yield newCampaign.save();
        res.status(201).json(newCampaign);
    }
    catch (error) {
        console.error('Error in createCampaign:', error);
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
        // Validate if the id is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid campaign ID format' });
            return;
        }
        // Validate status if provided
        if (status && !Object.values(Campaign_1.CampaignStatus).includes(status)) {
            res.status(400).json({ message: 'Invalid status value' });
            return;
        }
        // Ensure status is only ACTIVE or INACTIVE (not DELETED)
        if (status && status === Campaign_1.CampaignStatus.DELETED) {
            res.status(400).json({ message: 'Cannot set status to DELETED directly' });
            return;
        }
        // Find campaign by ID and ensure it's not deleted
        const campaign = yield Campaign_1.default.findOne({
            _id: id,
            status: { $ne: Campaign_1.CampaignStatus.DELETED }
        });
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        // Convert string accountIDs to ObjectIds if provided
        let objectIdAccountIDs;
        if (accountIDs && Array.isArray(accountIDs)) {
            objectIdAccountIDs = accountIDs
                .filter(id => mongoose_1.default.Types.ObjectId.isValid(id))
                .map(id => new mongoose_1.default.Types.ObjectId(id.toString()));
        }
        // Update campaign
        const updatedCampaign = yield Campaign_1.default.findByIdAndUpdate(id, {
            $set: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (description && { description })), (status && { status })), (leads && { leads })), (objectIdAccountIDs && { accountIDs: objectIdAccountIDs }))
        }, { new: true, runValidators: true });
        if (!updatedCampaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        res.status(200).json(updatedCampaign);
    }
    catch (error) {
        console.error('Error in updateCampaign:', error);
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
        // Validate if the id is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid campaign ID format' });
            return;
        }
        // Find campaign by ID and ensure it's not already deleted
        const campaign = yield Campaign_1.default.findOne({
            _id: id,
            status: { $ne: Campaign_1.CampaignStatus.DELETED }
        });
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        // Soft delete by setting status to DELETED
        campaign.status = Campaign_1.CampaignStatus.DELETED;
        yield campaign.save();
        res.status(200).json({
            message: 'Campaign deleted successfully',
            campaign
        });
    }
    catch (error) {
        console.error('Error in deleteCampaign:', error);
        res.status(500).json({
            message: 'Error deleting campaign',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.deleteCampaign = deleteCampaign;
