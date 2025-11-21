import { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole, OfferStatus } from '@prisma/client';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid offer ID' });
  }

  if (req.method === 'PATCH') {
    try {
      // Admin can update any offer, partners can only update their own
      const offer = await prisma.offer.findUnique({ where: { id } });

      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }

      if (req.user!.role !== UserRole.ADMIN && req.user!.userId !== offer.partnerId) {
        return res.status(403).json({ error: 'Not authorized to update this offer' });
      }

      const { status } = req.body;

      if (!status || !Object.values(OfferStatus).includes(status)) {
        return res.status(400).json({ error: 'Invalid offer status' });
      }

      const updatedOffer = await prisma.offer.update({
        where: { id },
        data: { status: status as OfferStatus },
        include: {
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              cargoName: true,
            },
          },
          partner: {
            select: {
              id: true,
              email: true,
              companyName: true,
            },
          },
        },
      });

      res.status(200).json({ offer: updatedOffer });
    } catch (error) {
      console.error('Error updating offer:', error);
      res.status(500).json({ error: 'Failed to update offer' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const offer = await prisma.offer.findUnique({ where: { id } });

      if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
      }

      if (req.user!.role !== UserRole.ADMIN && req.user!.userId !== offer.partnerId) {
        return res.status(403).json({ error: 'Not authorized to delete this offer' });
      }

      await prisma.offer.delete({ where: { id } });

      res.status(200).json({ message: 'Offer deleted successfully' });
    } catch (error) {
      console.error('Error deleting offer:', error);
      res.status(500).json({ error: 'Failed to delete offer' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAuth(handler);
