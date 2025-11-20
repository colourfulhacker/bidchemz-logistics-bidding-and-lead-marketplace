import { UserRole, SubscriptionTier, HazardClass, PackagingType, VehicleType, QuoteStatus, OfferStatus, ShipmentStatus, TransactionType, LeadType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding comprehensive test data...\n');

  const password = 'Test@123';
  const hashedPassword = await hashPassword(password);

  console.log('👥 Creating User Accounts...');

  const trader1 = await prisma.user.upsert({
    where: { email: 'trader1@test.com' },
    update: {},
    create: {
      email: 'trader1@test.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: UserRole.TRADER,
      companyName: 'ABC Chemicals Ltd',
      gstin: '27AABCT1234A1Z5',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Trader 1:', trader1.email);

  const trader2 = await prisma.user.upsert({
    where: { email: 'trader2@test.com' },
    update: {},
    create: {
      email: 'trader2@test.com',
      password: hashedPassword,
      phone: '+919876543220',
      role: UserRole.TRADER,
      companyName: 'Global Chemicals Corp',
      gstin: '29AAGCC9876B1Z5',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Trader 2:', trader2.email);

  const partner1 = await prisma.user.upsert({
    where: { email: 'partner1@test.com' },
    update: {},
    create: {
      email: 'partner1@test.com',
      password: hashedPassword,
      phone: '+919876543211',
      role: UserRole.LOGISTICS_PARTNER,
      companyName: 'Express Logistics India',
      gstin: '27AAEXP1234C1Z5',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Partner 1 (Premium):', partner1.email);

  const partner2 = await prisma.user.upsert({
    where: { email: 'partner2@test.com' },
    update: {},
    create: {
      email: 'partner2@test.com',
      password: hashedPassword,
      phone: '+919876543212',
      role: UserRole.LOGISTICS_PARTNER,
      companyName: 'SafeTrans Logistics',
      gstin: '29AASAF5678D1Z5',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Partner 2 (Standard):', partner2.email);

  const partner3 = await prisma.user.upsert({
    where: { email: 'partner3@test.com' },
    update: {},
    create: {
      email: 'partner3@test.com',
      password: hashedPassword,
      phone: '+919876543213',
      role: UserRole.LOGISTICS_PARTNER,
      companyName: 'ChemMove Solutions',
      gstin: '24AACMS9012E1Z5',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Partner 3 (Standard):', partner3.email);

  const partner4 = await prisma.user.upsert({
    where: { email: 'partner4@test.com' },
    update: {},
    create: {
      email: 'partner4@test.com',
      password: hashedPassword,
      phone: '+919876543214',
      role: UserRole.LOGISTICS_PARTNER,
      companyName: 'National Transport Co',
      gstin: '27AANAT3456F1Z5',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Partner 4 (Free):', partner4.email);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bidchemz.com' },
    update: {},
    create: {
      email: 'admin@bidchemz.com',
      password: hashedPassword,
      phone: '+919876543215',
      role: UserRole.ADMIN,
      companyName: 'BidChemz Platform',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Admin:', admin.email);

  console.log('\n🎯 Creating Partner Capabilities...');

  await prisma.partnerCapability.upsert({
    where: { userId: partner1.id },
    update: {},
    create: {
      userId: partner1.id,
      serviceTypes: ['ROAD_TRANSPORT', 'RAIL_TRANSPORT', 'WAREHOUSING'],
      dgClasses: [HazardClass.CLASS_3, HazardClass.CLASS_8, HazardClass.NON_HAZARDOUS],
      productCategories: ['CHEMICALS', 'SOLVENTS', 'ACIDS', 'ALKALIS'],
      serviceCities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad'],
      serviceStates: ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Telangana'],
      serviceCountries: ['India'],
      fleetTypes: [VehicleType.TRUCK, VehicleType.TANKER, VehicleType.ISO_TANK],
      fleetCount: 50,
      packagingCapabilities: [PackagingType.DRUMS, PackagingType.ISO_TANK, PackagingType.BAGS, PackagingType.TANKER],
      temperatureControlled: true,
      temperatureRange: '-20°C to +40°C',
      hasWarehouse: true,
      warehouseLocations: ['Mumbai', 'Delhi', 'Bangalore'],
      certifications: ['ISO_9001', 'PESO', 'ISO_14001'],
      subscriptionTier: SubscriptionTier.PREMIUM,
    },
  });
  console.log('✅ Partner 1 Capabilities (Premium - Full Coverage)');

  await prisma.partnerCapability.upsert({
    where: { userId: partner2.id },
    update: {},
    create: {
      userId: partner2.id,
      serviceTypes: ['ROAD_TRANSPORT'],
      dgClasses: [HazardClass.CLASS_3, HazardClass.CLASS_6, HazardClass.CLASS_8],
      productCategories: ['CHEMICALS', 'HAZARDOUS_MATERIALS'],
      serviceCities: ['Mumbai', 'Pune', 'Nashik', 'Surat'],
      serviceStates: ['Maharashtra', 'Gujarat'],
      serviceCountries: ['India'],
      fleetTypes: [VehicleType.TRUCK, VehicleType.TANKER],
      fleetCount: 25,
      packagingCapabilities: [PackagingType.DRUMS, PackagingType.BAGS, PackagingType.TANKER],
      temperatureControlled: false,
      hasWarehouse: false,
      warehouseLocations: [],
      certifications: ['PESO'],
      subscriptionTier: SubscriptionTier.STANDARD,
    },
  });
  console.log('✅ Partner 2 Capabilities (Standard - West India)');

  await prisma.partnerCapability.upsert({
    where: { userId: partner3.id },
    update: {},
    create: {
      userId: partner3.id,
      serviceTypes: ['ROAD_TRANSPORT', 'WAREHOUSING'],
      dgClasses: [HazardClass.NON_HAZARDOUS, HazardClass.CLASS_8],
      productCategories: ['CHEMICALS', 'SOLVENTS'],
      serviceCities: ['Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
      serviceStates: ['Delhi', 'Haryana', 'Uttar Pradesh'],
      serviceCountries: ['India'],
      fleetTypes: [VehicleType.TRUCK, VehicleType.CONTAINER],
      fleetCount: 15,
      packagingCapabilities: [PackagingType.DRUMS, PackagingType.IBC, PackagingType.BAGS],
      temperatureControlled: true,
      temperatureRange: '0°C to +30°C',
      hasWarehouse: true,
      warehouseLocations: ['Delhi'],
      certifications: ['ISO_9001'],
      subscriptionTier: SubscriptionTier.STANDARD,
    },
  });
  console.log('✅ Partner 3 Capabilities (Standard - North India)');

  await prisma.partnerCapability.upsert({
    where: { userId: partner4.id },
    update: {},
    create: {
      userId: partner4.id,
      serviceTypes: ['ROAD_TRANSPORT'],
      dgClasses: [HazardClass.NON_HAZARDOUS],
      productCategories: ['GENERAL_CARGO'],
      serviceCities: ['Bangalore', 'Chennai', 'Hyderabad'],
      serviceStates: ['Karnataka', 'Tamil Nadu', 'Telangana'],
      serviceCountries: ['India'],
      fleetTypes: [VehicleType.TRUCK],
      fleetCount: 10,
      packagingCapabilities: [PackagingType.BAGS, PackagingType.DRUMS],
      temperatureControlled: false,
      hasWarehouse: false,
      warehouseLocations: [],
      certifications: [],
      subscriptionTier: SubscriptionTier.FREE,
    },
  });
  console.log('✅ Partner 4 Capabilities (Free - South India, Non-Hazardous Only)');

  console.log('\n💰 Creating Lead Wallets...');

  await prisma.leadWallet.upsert({
    where: { userId: partner1.id },
    update: {},
    create: {
      userId: partner1.id,
      balance: 15000,
      lowBalanceAlert: true,
      alertThreshold: 5000,
    },
  });
  console.log('✅ Partner 1 Wallet: ₹15,000');

  await prisma.leadWallet.upsert({
    where: { userId: partner2.id },
    update: {},
    create: {
      userId: partner2.id,
      balance: 8000,
      lowBalanceAlert: true,
      alertThreshold: 2000,
    },
  });
  console.log('✅ Partner 2 Wallet: ₹8,000');

  await prisma.leadWallet.upsert({
    where: { userId: partner3.id },
    update: {},
    create: {
      userId: partner3.id,
      balance: 5000,
      lowBalanceAlert: true,
      alertThreshold: 1000,
    },
  });
  console.log('✅ Partner 3 Wallet: ₹5,000');

  await prisma.leadWallet.upsert({
    where: { userId: partner4.id },
    update: {},
    create: {
      userId: partner4.id,
      balance: 500,
      lowBalanceAlert: true,
      alertThreshold: 500,
    },
  });
  console.log('✅ Partner 4 Wallet: ₹500 (Low Balance!)');

  console.log('\n📦 Creating Sample Quotes...');

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  const quote1 = await prisma.quote.create({
    data: {
      quoteNumber: 'BID-2025-001',
      traderId: trader1.id,
      status: QuoteStatus.OFFERS_AVAILABLE,
      cargoName: 'Sulfuric Acid 98%',
      casNumber: '7664-93-9',
      quantity: 25,
      quantityUnit: 'MT',
      isHazardous: true,
      hazardClass: HazardClass.CLASS_8,
      unNumber: 'UN1830',
      cargoReadyDate: tomorrow,
      estimatedDeliveryDate: nextWeek,
      pickupAddress: 'Plot 123, MIDC Industrial Area',
      pickupCity: 'Mumbai',
      pickupState: 'Maharashtra',
      pickupPincode: '400001',
      pickupCountry: 'India',
      pickupContactName: 'Rajesh Kumar',
      pickupContactPhone: '+919876543210',
      deliveryAddress: 'Sector 25, Industrial Hub',
      deliveryCity: 'Delhi',
      deliveryState: 'Delhi',
      deliveryPincode: '110001',
      deliveryCountry: 'India',
      deliveryContactName: 'Amit Shah',
      deliveryContactPhone: '+919876543220',
      packagingType: PackagingType.DRUMS,
      packagingDetails: '200L HDPE Drums',
      specialHandling: 'Requires acid-resistant containers',
      temperatureControlled: false,
      preferredVehicleType: [VehicleType.TRUCK, VehicleType.TANKER],
      vehicleSpecifications: 'Acid-proof coating required',
      insuranceRequired: true,
      insuranceValue: 2500000,
      msdsRequired: true,
      paymentTerms: 'Net 30 days',
      additionalNotes: 'Urgent delivery required',
      expiresAt: oneHourFromNow,
      submittedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Quote 1: Hazardous (Class 8) - Mumbai to Delhi - OFFERS_AVAILABLE');

  const quote2 = await prisma.quote.create({
    data: {
      quoteNumber: 'BID-2025-002',
      traderId: trader1.id,
      status: QuoteStatus.MATCHING,
      cargoName: 'Ethanol 95%',
      casNumber: '64-17-5',
      quantity: 10,
      quantityUnit: 'MT',
      isHazardous: true,
      hazardClass: HazardClass.CLASS_3,
      unNumber: 'UN1170',
      cargoReadyDate: tomorrow,
      pickupAddress: 'Distillery Road, Industrial Estate',
      pickupCity: 'Pune',
      pickupState: 'Maharashtra',
      pickupPincode: '411001',
      pickupCountry: 'India',
      deliveryAddress: 'Chemical Park, Zone B',
      deliveryCity: 'Surat',
      deliveryState: 'Gujarat',
      deliveryPincode: '395001',
      deliveryCountry: 'India',
      packagingType: PackagingType.ISO_TANK,
      temperatureControlled: false,
      preferredVehicleType: [VehicleType.ISO_TANK],
      insuranceRequired: true,
      insuranceValue: 1000000,
      msdsRequired: true,
      paymentTerms: 'Advance payment',
      expiresAt: new Date(now.getTime() + 45 * 60 * 1000),
      submittedAt: new Date(now.getTime() - 15 * 60 * 1000),
    },
  });
  console.log('✅ Quote 2: Flammable (Class 3) - Pune to Surat - MATCHING');

  const quote3 = await prisma.quote.create({
    data: {
      quoteNumber: 'BID-2025-003',
      traderId: trader2.id,
      status: QuoteStatus.SELECTED,
      cargoName: 'Sodium Hydroxide Pellets',
      casNumber: '1310-73-2',
      quantity: 15,
      quantityUnit: 'MT',
      isHazardous: true,
      hazardClass: HazardClass.CLASS_8,
      unNumber: 'UN1823',
      cargoReadyDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      pickupAddress: 'Manufacturing Unit, GIDC',
      pickupCity: 'Ahmedabad',
      pickupState: 'Gujarat',
      pickupPincode: '380001',
      pickupCountry: 'India',
      deliveryAddress: 'Chemical Processing Plant',
      deliveryCity: 'Mumbai',
      deliveryState: 'Maharashtra',
      deliveryPincode: '400002',
      deliveryCountry: 'India',
      packagingType: PackagingType.BAGS,
      packagingDetails: '25kg PP bags',
      temperatureControlled: false,
      preferredVehicleType: [VehicleType.TRUCK],
      insuranceRequired: true,
      insuranceValue: 750000,
      msdsRequired: true,
      paymentTerms: 'Net 15 days',
      submittedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Quote 3: Corrosive (Class 8) - Ahmedabad to Mumbai - SELECTED');

  const quote4 = await prisma.quote.create({
    data: {
      quoteNumber: 'BID-2025-004',
      traderId: trader2.id,
      status: QuoteStatus.OFFERS_AVAILABLE,
      cargoName: 'Plastic Granules',
      quantity: 20,
      quantityUnit: 'MT',
      isHazardous: false,
      hazardClass: HazardClass.NON_HAZARDOUS,
      cargoReadyDate: nextWeek,
      pickupAddress: 'Factory Zone, Plot 45',
      pickupCity: 'Bangalore',
      pickupState: 'Karnataka',
      pickupPincode: '560001',
      pickupCountry: 'India',
      deliveryAddress: 'Industrial Area, Phase 2',
      deliveryCity: 'Chennai',
      deliveryState: 'Tamil Nadu',
      deliveryPincode: '600001',
      deliveryCountry: 'India',
      packagingType: PackagingType.BAGS,
      temperatureControlled: false,
      preferredVehicleType: [VehicleType.TRUCK, VehicleType.CONTAINER],
      insuranceRequired: false,
      msdsRequired: false,
      paymentTerms: 'Cash on delivery',
      expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
      submittedAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
  });
  console.log('✅ Quote 4: Non-Hazardous - Bangalore to Chennai - OFFERS_AVAILABLE');

  const quote5 = await prisma.quote.create({
    data: {
      quoteNumber: 'BID-2025-005',
      traderId: trader1.id,
      status: QuoteStatus.EXPIRED,
      cargoName: 'Acetone',
      casNumber: '67-64-1',
      quantity: 8,
      quantityUnit: 'MT',
      isHazardous: true,
      hazardClass: HazardClass.CLASS_3,
      unNumber: 'UN1090',
      cargoReadyDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      pickupAddress: 'Chemical Works, KIADB',
      pickupCity: 'Hyderabad',
      pickupState: 'Telangana',
      pickupPincode: '500001',
      pickupCountry: 'India',
      deliveryAddress: 'Processing Unit',
      deliveryCity: 'Pune',
      deliveryState: 'Maharashtra',
      deliveryPincode: '411002',
      deliveryCountry: 'India',
      packagingType: PackagingType.DRUMS,
      temperatureControlled: true,
      temperatureMin: 0,
      temperatureMax: 25,
      preferredVehicleType: [VehicleType.REFRIGERATED],
      insuranceRequired: true,
      insuranceValue: 500000,
      msdsRequired: true,
      expiresAt: new Date(now.getTime() - 60 * 60 * 1000),
      submittedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Quote 5: Flammable - Hyderabad to Pune - EXPIRED');

  console.log('\n💼 Creating Sample Offers...');

  const offer1 = await prisma.offer.create({
    data: {
      quoteId: quote1.id,
      partnerId: partner1.id,
      status: OfferStatus.PENDING,
      price: 125000,
      currency: 'INR',
      transitDays: 2,
      offerValidUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      pickupAvailableFrom: tomorrow,
      insuranceIncluded: true,
      trackingIncluded: true,
      customsClearance: false,
      valueAddedServices: ['Real-time tracking', '24/7 support', 'Insurance included'],
      termsAndConditions: 'Payment within 30 days of delivery',
      remarks: 'We have experience handling Class 8 hazardous materials',
      expiresAt: oneHourFromNow,
    },
  });
  console.log('✅ Offer 1: Partner 1 → Quote 1 (₹125,000)');

  const offer2 = await prisma.offer.create({
    data: {
      quoteId: quote1.id,
      partnerId: partner2.id,
      status: OfferStatus.PENDING,
      price: 118000,
      currency: 'INR',
      transitDays: 3,
      offerValidUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      pickupAvailableFrom: tomorrow,
      insuranceIncluded: false,
      trackingIncluded: true,
      customsClearance: false,
      valueAddedServices: ['GPS tracking', 'PESO certified'],
      termsAndConditions: 'Payment on delivery',
      remarks: 'Competitive pricing, experienced team',
      expiresAt: oneHourFromNow,
    },
  });
  console.log('✅ Offer 2: Partner 2 → Quote 1 (₹118,000) - LOWEST PRICE');

  const offer3 = await prisma.offer.create({
    data: {
      quoteId: quote1.id,
      partnerId: partner3.id,
      status: OfferStatus.PENDING,
      price: 132000,
      currency: 'INR',
      transitDays: 2,
      offerValidUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      pickupAvailableFrom: tomorrow,
      insuranceIncluded: true,
      trackingIncluded: true,
      customsClearance: false,
      valueAddedServices: ['Temperature monitoring', 'Dedicated vehicle'],
      termsAndConditions: 'Advance payment required',
      expiresAt: oneHourFromNow,
    },
  });
  console.log('✅ Offer 3: Partner 3 → Quote 1 (₹132,000)');

  const offer4 = await prisma.offer.create({
    data: {
      quoteId: quote3.id,
      partnerId: partner1.id,
      status: OfferStatus.ACCEPTED,
      price: 95000,
      currency: 'INR',
      transitDays: 1,
      offerValidUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      pickupAvailableFrom: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      insuranceIncluded: true,
      trackingIncluded: true,
      customsClearance: false,
      valueAddedServices: ['Express delivery', 'Priority handling'],
      isSelected: true,
      selectedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Offer 4: Partner 1 → Quote 3 (₹95,000) - ACCEPTED');

  const offer5 = await prisma.offer.create({
    data: {
      quoteId: quote3.id,
      partnerId: partner2.id,
      status: OfferStatus.REJECTED,
      price: 102000,
      currency: 'INR',
      transitDays: 2,
      offerValidUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      pickupAvailableFrom: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      insuranceIncluded: false,
      trackingIncluded: true,
      expiresAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Offer 5: Partner 2 → Quote 3 (₹102,000) - REJECTED');

  const offer6 = await prisma.offer.create({
    data: {
      quoteId: quote4.id,
      partnerId: partner4.id,
      status: OfferStatus.PENDING,
      price: 45000,
      currency: 'INR',
      transitDays: 3,
      offerValidUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      pickupAvailableFrom: nextWeek,
      insuranceIncluded: false,
      trackingIncluded: true,
      valueAddedServices: ['Basic tracking'],
      expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Offer 6: Partner 4 → Quote 4 (₹45,000) - Non-Hazardous');

  console.log('\n🚛 Creating Shipment for Selected Quote...');

  const shipment1 = await prisma.shipment.create({
    data: {
      shipmentNumber: 'SHIP-2025-001',
      quoteId: quote3.id,
      offerId: offer4.id,
      status: ShipmentStatus.IN_TRANSIT,
      currentLocation: 'Vadodara, Gujarat',
      estimatedDelivery: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      actualPickupDate: new Date(now.getTime() - 36 * 60 * 60 * 1000),
      statusUpdates: [
        { timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000), status: 'PICKUP_SCHEDULED', location: 'Ahmedabad' },
        { timestamp: new Date(now.getTime() - 30 * 60 * 60 * 1000), status: 'IN_TRANSIT', location: 'Ahmedabad' },
        { timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), status: 'IN_TRANSIT', location: 'Vadodara' },
      ],
      trackingEvents: [
        { timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000), event: 'Cargo picked up from warehouse', location: 'Ahmedabad' },
        { timestamp: new Date(now.getTime() - 30 * 60 * 60 * 1000), event: 'Vehicle departed', location: 'Ahmedabad' },
        { timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000), event: 'Rest stop', location: 'Vadodara' },
      ],
    },
  });
  console.log('✅ Shipment 1: Quote 3 - IN_TRANSIT');

  console.log('\n💳 Creating Lead Transactions...');

  const wallet1 = await prisma.leadWallet.findUnique({ where: { userId: partner1.id } });
  if (wallet1) {
    await prisma.leadTransaction.create({
      data: {
        walletId: wallet1.id,
        offerId: offer4.id,
        transactionType: TransactionType.DEBIT,
        amount: -500,
        description: 'Lead cost for Quote BID-2025-003',
        leadId: quote3.id,
        leadType: LeadType.EXCLUSIVE,
        leadCost: 500,
        creditsDeducted: 500,
        hazardCategory: HazardClass.CLASS_8,
        routeDistance: 450,
        quantity: 15,
        vehicleType: VehicleType.TRUCK,
      },
    });
    console.log('✅ Transaction: Partner 1 - Lead deduction ₹500 for selected offer');

    await prisma.leadTransaction.create({
      data: {
        walletId: wallet1.id,
        transactionType: TransactionType.RECHARGE,
        amount: 10000,
        description: 'Wallet recharge via bank transfer',
        invoiceId: 'INV-2025-0001',
        gstAmount: 1800,
      },
    });
    console.log('✅ Transaction: Partner 1 - Wallet recharge ₹10,000');
  }

  console.log('\n📝 Creating Policy Consents...');

  const policyVersion = '1.0.0';
  const ipAddress = '192.168.1.1';
  const userAgent = 'Mozilla/5.0 (Test Seed Script)';

  for (const user of [trader1, trader2, partner1, partner2, partner3, partner4, admin]) {
    await prisma.policyConsent.create({
      data: {
        userId: user.id,
        policyType: 'TERMS_OF_SERVICE',
        policyVersion,
        accepted: true,
        acceptedAt: user.createdAt,
        ipAddress,
        userAgent,
      },
    });

    await prisma.policyConsent.create({
      data: {
        userId: user.id,
        policyType: 'PRIVACY_POLICY',
        policyVersion,
        accepted: true,
        acceptedAt: user.createdAt,
        ipAddress,
        userAgent,
      },
    });

    if (user.role === UserRole.LOGISTICS_PARTNER) {
      await prisma.policyConsent.create({
        data: {
          userId: user.id,
          policyType: 'PARTNER_POLICY',
          policyVersion,
          accepted: true,
          acceptedAt: user.createdAt,
          ipAddress,
          userAgent,
        },
      });
    }
  }
  console.log('✅ Policy consents created for all users');

  console.log('\n📊 Creating Pricing Tiers...');

  await prisma.pricingTier.upsert({
    where: { tierName: 'FREE' },
    update: {},
    create: {
      tierName: 'FREE',
      subscriptionTier: SubscriptionTier.FREE,
      baseLeadCost: 300,
      hazardMultiplier: { NON_HAZARDOUS: 1.0, CLASS_3: 2.0, CLASS_8: 2.5 },
      distanceMultiplier: { '0-100': 1.0, '100-500': 1.5, '500+': 2.0 },
      quantityMultiplier: { '0-10': 1.0, '10-50': 1.2, '50+': 1.5 },
      vehicleMultiplier: { TRUCK: 1.0, TANKER: 1.5, ISO_TANK: 1.8 },
      urgencyMultiplier: { NORMAL: 1.0, URGENT: 1.5 },
      stateWisePricing: {},
      maxLeadsPerDay: 5,
      exclusiveLeads: false,
      priorityMatching: false,
    },
  });

  await prisma.pricingTier.upsert({
    where: { tierName: 'STANDARD' },
    update: {},
    create: {
      tierName: 'STANDARD',
      subscriptionTier: SubscriptionTier.STANDARD,
      baseLeadCost: 250,
      hazardMultiplier: { NON_HAZARDOUS: 1.0, CLASS_3: 1.8, CLASS_8: 2.2 },
      distanceMultiplier: { '0-100': 1.0, '100-500': 1.4, '500+': 1.8 },
      quantityMultiplier: { '0-10': 1.0, '10-50': 1.1, '50+': 1.3 },
      vehicleMultiplier: { TRUCK: 1.0, TANKER: 1.4, ISO_TANK: 1.6 },
      urgencyMultiplier: { NORMAL: 1.0, URGENT: 1.3 },
      stateWisePricing: {},
      maxLeadsPerDay: 20,
      exclusiveLeads: false,
      priorityMatching: true,
    },
  });

  await prisma.pricingTier.upsert({
    where: { tierName: 'PREMIUM' },
    update: {},
    create: {
      tierName: 'PREMIUM',
      subscriptionTier: SubscriptionTier.PREMIUM,
      baseLeadCost: 200,
      hazardMultiplier: { NON_HAZARDOUS: 1.0, CLASS_3: 1.5, CLASS_8: 1.8 },
      distanceMultiplier: { '0-100': 1.0, '100-500': 1.3, '500+': 1.6 },
      quantityMultiplier: { '0-10': 1.0, '10-50': 1.05, '50+': 1.2 },
      vehicleMultiplier: { TRUCK: 1.0, TANKER: 1.3, ISO_TANK: 1.5 },
      urgencyMultiplier: { NORMAL: 1.0, URGENT: 1.2 },
      stateWisePricing: {},
      maxLeadsPerDay: null,
      exclusiveLeads: true,
      priorityMatching: true,
    },
  });
  console.log('✅ Pricing tiers configured (FREE, STANDARD, PREMIUM)');

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n' + '='.repeat(70));
  console.log('📋 TEST CREDENTIALS SUMMARY');
  console.log('='.repeat(70));
  console.log('\n🔐 All accounts use password: Test@123\n');
  
  console.log('👤 TRADERS:');
  console.log('  1. trader1@test.com - ABC Chemicals Ltd');
  console.log('     - 3 quotes created (Active, Matching, Expired)');
  console.log('  2. trader2@test.com - Global Chemicals Corp');
  console.log('     - 2 quotes created (Selected, Active)\n');
  
  console.log('🚚 LOGISTICS PARTNERS:');
  console.log('  1. partner1@test.com - Express Logistics India (PREMIUM)');
  console.log('     - Wallet: ₹15,000 | Coverage: Pan-India');
  console.log('     - Handles: Class 3, 8, Non-Hazardous | Fleet: 50 vehicles');
  console.log('  2. partner2@test.com - SafeTrans Logistics (STANDARD)');
  console.log('     - Wallet: ₹8,000 | Coverage: West India');
  console.log('     - Handles: Class 3, 6, 8 | Fleet: 25 vehicles');
  console.log('  3. partner3@test.com - ChemMove Solutions (STANDARD)');
  console.log('     - Wallet: ₹5,000 | Coverage: North India');
  console.log('     - Handles: Class 8, Non-Hazardous | Fleet: 15 vehicles');
  console.log('  4. partner4@test.com - National Transport Co (FREE)');
  console.log('     - Wallet: ₹500 ⚠️ LOW | Coverage: South India');
  console.log('     - Handles: Non-Hazardous only | Fleet: 10 vehicles\n');
  
  console.log('⚙️ ADMIN:');
  console.log('  admin@bidchemz.com - Full system access\n');
  
  console.log('📊 SAMPLE DATA:');
  console.log('  - 5 Quotes (Various statuses and hazard classes)');
  console.log('  - 6 Offers (Pending, Accepted, Rejected)');
  console.log('  - 1 Active Shipment (In Transit)');
  console.log('  - Lead transactions and wallet history');
  console.log('  - 3 Pricing tiers configured\n');
  
  console.log('='.repeat(70));
  console.log('🎉 Ready for testing! Login and explore the platform.');
  console.log('='.repeat(70) + '\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
