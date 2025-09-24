import type { NextApiRequest, NextApiResponse } from 'next';
import { generateStory } from '@/lib/gemini';
import type { StoryRequest, StoryResponse, ErrorResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StoryResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const storyRequest: StoryRequest = req.body;

    // Validate required fields
    if (!storyRequest.time || !storyRequest.place || !storyRequest.characters || !storyRequest.mood) {
      return res.status(400).json({ error: 'Trūksta privalomų laukų' });
    }

    const story = await generateStory(storyRequest);
    
    res.status(200).json({ story });
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ 
      error: 'Įvyko klaida generuojant pasaką',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}