import express, { Request, Response } from 'express';
import Quote, { IQuote } from '../models/quote';
import OpenAI from 'openai';  // Correct import
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Ensure OPENAI_API_KEY is available
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is not defined');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

// Get a random quote from database
router.get('/random', async (req: Request, res: Response) => {
  try {
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Generate a new quote using AI
router.get('/generate', async (req: Request, res: Response) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "Generate an inspirational quote:" }],
    });

    const generatedQuote = completion.choices[0]?.message?.content?.trim() || '';
    
    // You might want to implement logic here to separate the quote and author
    // For simplicity, we're assuming the entire generated text is the quote
    const newQuote = new Quote({
      text: generatedQuote,
      author: "AI"
    });

    await newQuote.save();
    res.json(newQuote);
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({ message: "Failed to generate quote" });
  }
});

// Add a new quote
router.post('/', async (req: Request, res: Response) => {
  const quote = new Quote({
    text: req.body.text,
    author: req.body.author,
  });

  try {
    const newQuote = await quote.save();
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

export default router;