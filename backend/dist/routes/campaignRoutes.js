"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaignController_1 = require("../controllers/campaignController");
const router = express_1.default.Router();
// GET all campaigns
router.get('/', campaignController_1.getCampaigns);
// GET a single campaign
router.get('/:id', campaignController_1.getCampaignById);
// POST a new campaign
router.post('/', campaignController_1.createCampaign);
// PUT update a campaign
router.put('/:id', campaignController_1.updateCampaign);
// DELETE a campaign (soft delete)
router.delete('/:id', campaignController_1.deleteCampaign);
exports.default = router;
