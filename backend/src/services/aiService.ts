import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Define the profile interface
export interface Profile {
  name: string;
  job_title: string;
  company: string;
  location?: string;
  summary?: string;
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Generates a personalized outreach message based on a LinkedIn profile
 * @param profile The LinkedIn profile data
 * @returns A personalized message
 */
export async function generatePersonalizedMessage(profile: Profile): Promise<string> {
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
    const result = await model.generateContent(prompt);
    const response = result.response;
    const message = response.text();

    console.log('Generated message preview:', message.substring(0, 50) + '...');
    return message;
  } catch (error) {
    console.error('Error generating personalized message with Gemini:', error);

    // Fallback message if API call fails
    return `Hey ${profile.name}, I noticed you're a ${profile.job_title} at ${profile.company}. Our campaign management system could help streamline your outreach efforts. Would you be open to a quick chat?`;
  }
}

