import { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole, ShipmentStatus } from '@prisma/client';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid shipment ID' });
  }

  if (req.method === 'PATCH') {
    try {
      // Only admin can update shipment status
      if (req.user!.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: 'Only admins can update shipment status' });
      }

      const shipment = await prisma.shipment.findUnique({ where: { id } });

      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      const { status, currentLocation, statusUpdates, trackingEvents } = req.body;

      if (status && !Object.values(ShipmentStatus).includes(status)) {
        return res.status(400).json({ error: 'Invalid shipment status' });
      }

      const updateData: any = {};
      if (status) updateData.status = status;
      if (currentLocation) updateData.currentLocation = currentLocation;
      if (statusUpdates) updateData.statusUpdates = statusUpdates;
      if (trackingEvents) updateData.trackingEvents = trackingEvents;

      const updatedShipment = await prisma.shipment.update({
        where: { id },
        data: updateData,
        include: {
          quote: true,
          offer: {
            include: {
              partner: {
                select: {
                  id: true,
                  companyName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json({ shipment: updatedShipment });
    } catch (error) {
      console.error('Error updating shipment:', error);
      res.status(500).json({ error: 'Failed to update shipment' });
    }
  } else if (req.method === 'GET') {
    try {
      const shipment = await prisma.shipment.findUnique({
        where: { id },
        include: {
          quote: true,
          offer: {
            include: {
              partner: true,
            },
          },
        },
      });

      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }

      res.status(200).json({ shipment });
    } catch (error) {
      console.error('Error fetching shipment:', error);
      res.status(500).json({ error: 'Failed to fetch shipment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAuth(handler);
