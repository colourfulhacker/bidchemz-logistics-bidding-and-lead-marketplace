import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { method, body, headers } = req;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid offer ID' });
  }

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:5000'}/api/offers/${id}`,
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
