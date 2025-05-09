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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePersonalizedMessage = generatePersonalizedMessage;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
// Ensure environment variables are loaded
dotenv_1.default.config();
// Initialize the Gemini API client
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
/**
 * Generates a personalized outreach message based on a LinkedIn profile
 * @param profile The LinkedIn profile data
 * @returns A personalized message
 */
function generatePersonalizedMessage(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a prompt that includes the profile information
            const prompt = `
      Generate a personalized LinkedIn outreach message for the following person:

      Name: ${profile.name}
      Job Title: ${profile.job_title}
      Company: ${profile.company}
      Location: ${profile.location || 'Not specified'}
      Summary: ${profile.summary || 'Not provided'}

      The message should be friendly, professional, and mention how our campaign management system can help them.
      Keep it concise (under 150 words) and personalized based on their job and company.

      IMPORTANT:
      - Use "Campaign Management System" as the product name
      - Sign the message as "The Campaign Management Team"
      - DO NOT use placeholders like [Your Name] or [Your Company]
      - Write as if you are a real person from the Campaign Management Team
    `;
            // Generate content using Gemini API
            const result = yield model.generateContent(prompt);
            const response = result.response;
            const message = response.text();
            console.log('Generated message preview:', message.substring(0, 50) + '...');
            return message;
        }
        catch (error) {
            console.error('Error generating personalized message with Gemini:', error);
            // Fallback message if API call fails
            return `Hey ${profile.name}, I noticed you're a ${profile.job_title} at ${profile.company}. Our campaign management system could help streamline your outreach efforts. Would you be open to a quick chat?`;
        }
    });
}
