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
exports.createPersonalizedMessage = void 0;
const aiService_1 = require("../services/aiService");
const createPersonalizedMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received personalized message request');
        console.log(req.body);
        const { name, job_title, company, location, summary } = req.body;
        console.log(`Request for: ${name}, ${job_title} at ${company}`);
        if (!name || !job_title || !company) {
            res.status(400).json({ message: 'Name, job title, and company are required' });
            return;
        }
        const profile = {
            name,
            job_title,
            company,
            location: location || '',
            summary: summary || ''
        };
        console.log('Calling generatePersonalizedMessage with profile data');
        const message = yield (0, aiService_1.generatePersonalizedMessage)(profile);
        console.log('Message generated successfully');
        console.log('Message preview:', message.substring(0, 50) + '...');
        res.status(200).json({
            message,
            model: "gemini-2.0-flash"
        });
    }
    catch (error) {
        console.error('Error in createPersonalizedMessage controller:', error);
        res.status(500).json({
            message: 'Error generating personalized message',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.createPersonalizedMessage = createPersonalizedMessage;
