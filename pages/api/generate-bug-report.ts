import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { log } = req.body;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: log }],
    });

    const report = formatReport(response.choices[0].message.content);
    res.status(200).json({ report });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function formatReport(content: string) {
  return `# Bug Report\n\n## Steps to Reproduce\n${content}\n\n## Expected vs Actual\n- Expected: [Your expected behavior]\n- Actual: [Observed behavior]\n\n## Severity\n- Severity Level: [Specify severity]\n\n## Possible Fix\n- Suggested Fix: [Provide suggestions]`;
}