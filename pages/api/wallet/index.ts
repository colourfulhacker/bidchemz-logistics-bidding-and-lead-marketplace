import { NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { UserRole, TransactionType } from '@prisma/client';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      if (req.user!.role !== UserRole.LOGISTICS_PARTNER) {
        return res.status(403).json({
          error: 'Only logistics partners can access wallet',
        });
      }

      const wallet = await prisma.leadWallet.findUnique({
        where: { userId: req.user!.userId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
        },
      });

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      res.status(200).json({ wallet });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ error: 'Failed to fetch wallet' });
    }
  } else if (req.method === 'POST') {
    try {
      if (req.user!.role !== UserRole.LOGISTICS_PARTNER) {
        return res.status(403).json({
          error: 'Only logistics partners can recharge wallet',
        });
      }

      const { amount, paymentMethod } = req.body;

      if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
        return res.status(400).json({ error: 'Invalid amount (must be between 0 and 1,000,000)' });
      }

      let wallet = await prisma.leadWallet.findUnique({
        where: { userId: req.user!.userId },
      });

      if (!wallet) {
        wallet = await prisma.leadWallet.create({
          data: {
            userId: req.user!.userId,
            balance: 0,
          },
        });
      }

      const updatedWallet = await prisma.leadWallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      await prisma.leadTransaction.create({
        data: {
          walletId: wallet.id,
          transactionType: TransactionType.RECHARGE,
          amount,
          description: `Wallet recharge via ${paymentMethod || 'manual'}`,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: req.user!.userId,
          action: 'RECHARGE_WALLET',
          entity: 'WALLET',
          entityId: wallet.id,
          changes: { amount, newBalance: updatedWallet.balance },
        },
      });

      res.status(200).json({
        wallet: updatedWallet,
        message: 'Wallet recharged successfully',
      });
    } catch (error) {
      console.error('Error recharging wallet:', error);
      res.status(500).json({ error: 'Failed to recharge wallet' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default withAuth(handler);
