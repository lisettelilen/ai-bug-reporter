import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { log } = req.body;

  if (!log) {
    return res.status(400).json({ error: 'Log is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert QA engineer. Analyze the provided log or error and generate a structured bug report including: Title, Severity, Steps to Reproduce, Expected vs Actual Behavior, and Potential Solution.',
        },
        {
          role: 'user',
          content: log,
        },
      ],
    });

    const report = response.choices[0]?.message?.content || 'No report generated.';
    return res.status(200).json({ report });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error generating report' });
  }
}