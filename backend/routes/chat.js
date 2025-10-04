import { Router } from 'express';
import OpenAI from 'openai';
import 'dotenv/config'; // if using ES modules (import syntax)


const router = Router();

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/chat', async (req, res) => {
  try {
    const { message, language, languageName } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create system message with language instruction
    const systemMessage = {
      role: 'system',
      content: `You are a helpful travel assistant. Always respond in ${languageName}. If the user writes in a different language, understand their message but still respond in ${languageName}. Keep responses natural and conversational. Focus on travel-related topics and provide culturally relevant information when applicable.`
    };

    const completion = await openai.chat.completions.create({
      messages: [
        systemMessage,
        { role: 'user', content: message }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response';
    res.json({ message: reply });
    
  } catch (error) {
    console.error('OpenAI API error:', error);

    // Check for specific OpenAI error types
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          return res.status(401).json({ error: 'API key missing or invalid' });
        case 429:
          return res.status(429).json({ error: 'Rate limit exceeded. Please try again later' });
        case 500:
          return res.status(500).json({ error: 'OpenAI service error. Please try again later' });
        default:
          if (error.message) {
            return res.status(error.status || 500).json({ error: error.message });
          }
      }
    }

    // Network or other errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ error: 'Unable to connect to AI service' });
    }

    // Generic fallback
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later' });
  }
});

export default router;