import { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole } from '@prisma/client';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid offer ID' });
  }

  if (req.method === 'PATCH') {
    try {
      if (req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Only admins can update offers' });
      }

      const { status, price, transitDays } = req.body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (price !== undefined) updateData.price = price;
      if (transitDays !== undefined) updateData.transitDays = transitDays;

      const updatedOffer = await prisma.offer.update({
        where: { id },
        data: updateData,
        include: {
          quote: { select: { id: true, quoteNumber: true, cargoName: true } },
          partner: { select: { id: true, email: true, companyName: true } },
        },
      });

      res.status(200).json({ offer: updatedOffer });
    } catch (error) {
      console.error('Error updating offer:', error);
      res.status(500).json({ error: 'Failed to update offer' });
    }
  } else if (req.method === 'DELETE') {
    try {
      if (req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Only admins can delete offers' });
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
