import { PrismaClient, UserRole, SubscriptionTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding test accounts...');

  const password = 'Test@123';
  const hashedPassword = await hashPassword(password);

  // Create Trader account
  const trader = await prisma.user.upsert({
    where: { email: 'trader@test.com' },
    update: {},
    create: {
      email: 'trader@test.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: UserRole.TRADER,
      companyName: 'ABC Chemicals Ltd',
      gstin: 'GST123456789',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Created Trader:', trader.email);

  // Create Logistics Partner account
  const partner = await prisma.user.upsert({
    where: { email: 'partner@test.com' },
    update: {},
    create: {
      email: 'partner@test.com',
      password: hashedPassword,
      phone: '+919876543211',
      role: UserRole.LOGISTICS_PARTNER,
      companyName: 'XYZ Logistics Pvt Ltd',
      gstin: 'GST987654321',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Created Logistics Partner:', partner.email);

  // Create Partner Capabilities
  await prisma.partnerCapability.upsert({
    where: { userId: partner.id },
    update: {},
    create: {
      userId: partner.id,
      serviceTypes: ['ROAD_TRANSPORT', 'WAREHOUSING'],
      dgClasses: ['CLASS_3', 'CLASS_8'],
      productCategories: ['CHEMICALS', 'SOLVENTS'],
      serviceCities: ['Mumbai', 'Delhi', 'Bangalore'],
      serviceStates: ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat'],
      serviceCountries: ['India'],
      fleetTypes: ['TRUCK', 'TANKER'],
      packagingCapabilities: ['DRUMS', 'ISO_TANK', 'BAGS'],
      temperatureControlled: true,
      certifications: ['ISO_9001', 'PESO'],
      warehouseLocations: ['Mumbai', 'Delhi'],
      subscriptionTier: SubscriptionTier.STANDARD,
    },
  });
  console.log('✅ Created Partner Capabilities');

  // Create Lead Wallet for Partner
  await prisma.leadWallet.upsert({
    where: { userId: partner.id },
    update: {},
    create: {
      userId: partner.id,
      balance: 5000,
      lowBalanceAlert: true,
      alertThreshold: 1000,
    },
  });
  console.log('✅ Created Lead Wallet with ₹5000 balance');

  // Create Admin account
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bidchemz.com' },
    update: {},
    create: {
      email: 'admin@bidchemz.com',
      password: hashedPassword,
      phone: '+919876543212',
      role: UserRole.ADMIN,
      companyName: 'BidChemz Platform',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Created Admin:', admin.email);

  console.log('\n📋 Test Accounts Summary:');
  console.log('========================');
  console.log('1. Trader Account');
  console.log('   Email: trader@test.com');
  console.log('   Password: Test@123');
  console.log('   Company: ABC Chemicals Ltd\n');
  
  console.log('2. Logistics Partner Account');
  console.log('   Email: partner@test.com');
  console.log('   Password: Test@123');
  console.log('   Company: XYZ Logistics Pvt Ltd');
  console.log('   Wallet Balance: ₹5000\n');
  
  console.log('3. Admin Account');
  console.log('   Email: admin@bidchemz.com');
  console.log('   Password: Test@123');
  console.log('   Company: BidChemz Platform\n');
  
  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
