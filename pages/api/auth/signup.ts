import { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '@prisma/client';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      password,
      phone,
      role,
      companyName,
      gstin,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        error: 'Email, password, and role are required',
      });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        error: 'Invalid role. Must be TRADER, LOGISTICS_PARTNER, or ADMIN',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists',
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        role,
        companyName,
        gstin,
        isVerified: false,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        companyName: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (role === UserRole.LOGISTICS_PARTNER) {
      await prisma.partnerCapability.create({
        data: {
          userId: user.id,
          serviceTypes: [],
          dgClasses: [],
          productCategories: [],
          serviceCities: [],
          serviceStates: [],
          serviceCountries: [],
          fleetTypes: [],
          packagingCapabilities: [],
          certifications: [],
          warehouseLocations: [],
        },
      });

      await prisma.leadWallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      companyName: user.companyName || undefined,
    });

    res.status(201).json({
      user,
      token,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
