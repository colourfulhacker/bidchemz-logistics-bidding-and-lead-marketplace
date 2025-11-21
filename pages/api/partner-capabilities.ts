import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.user!.role !== UserRole.LOGISTICS_PARTNER) {
    return res.status(403).json({ error: 'Only partners can manage capabilities' });
  }

  if (req.method === 'GET') {
    try {
      const capabilities = await prisma.partnerCapability.findUnique({
        where: { userId: req.user!.userId },
      });
      if (!capabilities) {
        return res.status(404).json({ error: 'Partner capabilities not found' });
      }
      res.status(200).json({ capabilities });
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      res.status(500).json({ error: 'Failed to fetch capabilities' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const {
        serviceCities,
        serviceStates,
        serviceCountries,
        certifications,
        warehouseLocations,
        hasWarehouse,
      } = req.body;

      const updateData: any = {};
      if (serviceCities) updateData.serviceCities = serviceCities;
      if (serviceStates) updateData.serviceStates = serviceStates;
      if (serviceCountries) updateData.serviceCountries = serviceCountries;
      if (warehouseLocations) updateData.warehouseLocations = warehouseLocations;
      if (hasWarehouse !== undefined) updateData.hasWarehouse = hasWarehouse;
      
      // Store certifications as JSON in productCategories if it doesn't have its own field
      if (certifications) {
        updateData.productCategories = certifications;
      }

      const updated = await prisma.partnerCapability.update({
        where: { userId: req.user!.userId },
        data: updateData,
      });

      res.status(200).json({
        message: 'Capabilities updated successfully',
        capabilities: updated,
      });
    } catch (error) {
      console.error('Error updating capabilities:', error);
      res.status(500).json({ error: 'Failed to update capabilities' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAuth(handler);
