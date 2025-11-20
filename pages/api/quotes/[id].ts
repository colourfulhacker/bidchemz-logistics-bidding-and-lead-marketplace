import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole } from '@prisma/client';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid quote ID' });
  }

  if (req.method === 'GET') {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id },
        include: {
          trader: {
            select: {
              id: true,
              email: true,
              companyName: true,
            },
          },
          offers: {
            include: {
              partner: {
                select: {
                  id: true,
                  email: true,
                  companyName: true,
                },
              },
            },
            orderBy: {
              price: 'asc',
            },
          },
          shipment: true,
          documents: true,
        },
      });

      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      if (req.user!.role === UserRole.TRADER && quote.traderId !== req.user!.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.status(200).json({ quote });
    } catch (error) {
      console.error('Error fetching quote:', error);
      res.status(500).json({ error: 'Failed to fetch quote' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id },
      });

      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      if (quote.traderId !== req.user!.userId && req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedQuote = await prisma.quote.update({
        where: { id },
        data: req.body,
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.userId,
          quoteId: id,
          action: 'UPDATE',
          entity: 'QUOTE',
          entityId: id,
          changes: req.body,
        },
      });

      res.status(200).json({ quote: updatedQuote });
    } catch (error) {
      console.error('Error updating quote:', error);
      res.status(500).json({ error: 'Failed to update quote' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAuth(handler);
