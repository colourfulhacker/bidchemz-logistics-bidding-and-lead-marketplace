import { NextApiRequest, NextApiResponse } from 'next';

// Versioned API route - delegates to main endpoint
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, method, body, headers } = req;
  
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/offers`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Cookie: headers.cookie || '',
        },
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API v1 error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
