import { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole, OfferStatus } from '@prisma/client';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { quoteId, status } = req.query;

      const where: any = {};

      if (req.user!.role === UserRole.LOGISTICS_PARTNER) {
        where.partnerId = req.user!.userId;
      }

      if (quoteId && typeof quoteId === 'string') {
        where.quoteId = quoteId;
      }

      if (status && typeof status === 'string') {
        where.status = status as OfferStatus;
      }

      const offers = await prisma.offer.findMany({
        where,
        include: {
          quote: {
            select: {
              id: true,
              quoteNumber: true,
              cargoName: true,
              quantity: true,
              quantityUnit: true,
              pickupCity: true,
              deliveryCity: true,
              cargoReadyDate: true,
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
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({ offers });
    } catch (error) {
      console.error('Error fetching offers:', error);
      res.status(500).json({ error: 'Failed to fetch offers' });
    }
  } else if (req.method === 'POST') {
    try {
      if (req.user!.role !== UserRole.LOGISTICS_PARTNER) {
        return res.status(403).json({
          error: 'Only logistics partners can submit offers',
        });
      }

      const {
        quoteId,
        price,
        transitDays,
        offerValidUntil,
        pickupAvailableFrom,
        insuranceIncluded,
        trackingIncluded,
        customsClearance,
        valueAddedServices,
        termsAndConditions,
        remarks,
      } = req.body;

      if (!quoteId || !price || !transitDays || !offerValidUntil || !pickupAvailableFrom) {
        return res.status(400).json({
          error: 'Missing required fields',
        });
      }

      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
      });

      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }

      const existingOffer = await prisma.offer.findFirst({
        where: {
          quoteId,
          partnerId: req.user!.userId,
          status: { not: OfferStatus.WITHDRAWN },
        },
      });

      if (existingOffer) {
        return res.status(409).json({
          error: 'You have already submitted an offer for this quote',
        });
      }

      const wallet = await prisma.leadWallet.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!wallet || wallet.balance <= 0) {
        return res.status(400).json({
          error: 'Insufficient lead wallet balance',
        });
      }

      const expiresAt = new Date(offerValidUntil);

      const offer = await prisma.offer.create({
        data: {
          quoteId,
          partnerId: req.user!.userId,
          price,
          transitDays,
          offerValidUntil: new Date(offerValidUntil),
          pickupAvailableFrom: new Date(pickupAvailableFrom),
          insuranceIncluded: insuranceIncluded || false,
          trackingIncluded: trackingIncluded !== false,
          customsClearance: customsClearance || false,
          valueAddedServices: valueAddedServices || [],
          termsAndConditions,
          remarks,
          expiresAt,
        },
        include: {
          quote: true,
          partner: {
            select: {
              id: true,
              email: true,
              companyName: true,
            },
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: 'CREATE',
          entity: 'OFFER',
          entityId: offer.id,
          changes: { quoteId, price },
        },
      });

      res.status(201).json({
        offer,
        message: 'Offer submitted successfully',
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      res.status(500).json({ error: 'Failed to create offer' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAuth(handler);
