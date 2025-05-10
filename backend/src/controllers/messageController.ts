import { Request, Response } from 'express';
import { generatePersonalizedMessage, Profile } from '../services/aiService';

export const createPersonalizedMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Received personalized message request');
    console.log(req.body)
    const { name, job_title, company, location, summary } = req.body;
    console.log(`Request for: ${name}, ${job_title} at ${company}`);

    if (!name || !job_title || !company) {
      res.status(400).json({ message: 'Name, job title, and company are required' });
      return;
    }

    const profile: Profile = {
      name,
      job_title,
      company,
      location: location || '',
      summary: summary || ''
    };

    console.log('Calling generatePersonalizedMessage with profile data');
    const message = await generatePersonalizedMessage(profile);
    console.log('Message generated successfully');
    console.log('Message preview:', message.substring(0, 50) + '...');

    res.status(200).json({
      message,
      model: "gemini-2.0-flash"
    });
  } catch (error) {
    console.error('Error in createPersonalizedMessage controller:', error);
    res.status(500).json({
      message: 'Error generating personalized message',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
