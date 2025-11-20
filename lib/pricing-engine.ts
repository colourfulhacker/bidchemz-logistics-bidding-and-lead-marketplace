import { HazardClass, VehicleType, SubscriptionTier } from '@prisma/client';

export interface PricingParams {
  hazardClass: HazardClass | null;
  quantity: number;
  pickupState: string;
  deliveryState: string;
  vehicleType: VehicleType[];
  subscriptionTier: SubscriptionTier;
  isUrgent?: boolean;
}

interface PricingMultipliers {
  hazard: Record<HazardClass | 'NON_HAZARDOUS', number>;
  distance: Record<string, number>; // State pairs
  quantity: { ranges: { min: number; max: number; multiplier: number }[] };
  vehicle: Record<VehicleType, number>;
  urgency: number;
  tier: Record<SubscriptionTier, number>; // Discount multipliers
}

const PRICING_MULTIPLIERS: PricingMultipliers = {
  hazard: {
    NON_HAZARDOUS: 1.0,
    CLASS_1: 2.5, // Explosives
    CLASS_2: 1.8, // Gases
    CLASS_3: 1.6, // Flammable liquids
    CLASS_4: 1.5, // Flammable solids
    CLASS_5: 1.7, // Oxidizing substances
    CLASS_6: 1.9, // Toxic substances
    CLASS_7: 2.0, // Radioactive
    CLASS_8: 1.6, // Corrosives
    CLASS_9: 1.3, // Miscellaneous
  },
  distance: {
    // Intra-state
    'SAME_STATE': 1.0,
    // Short distance (neighboring states)
    'SHORT': 1.3,
    // Medium distance
    'MEDIUM': 1.6,
    // Long distance (cross-country)
    'LONG': 2.0,
  },
  quantity: {
    ranges: [
      { min: 0, max: 10, multiplier: 1.5 }, // Small quantities cost more per unit
      { min: 10, max: 50, multiplier: 1.2 },
      { min: 50, max: 100, multiplier: 1.0 },
      { min: 100, max: 500, multiplier: 0.9 },
      { min: 500, max: Infinity, multiplier: 0.8 }, // Bulk discount
    ],
  },
  vehicle: {
    TRUCK: 1.0,
    CONTAINER: 1.1,
    TANKER: 1.3,
    ISO_TANK: 1.5,
    FLATBED: 1.1,
    REFRIGERATED: 1.4,
  },
  urgency: 1.3, // 30% premium for urgent requests
  tier: {
    PREMIUM: 0.7, // 30% discount for premium partners
    STANDARD: 0.85, // 15% discount for standard partners
    FREE: 1.0, // Full price for free tier
  },
};

// Base lead cost in INR
const BASE_LEAD_COST = 500;

// State-wise distance classification
const STATE_DISTANCES: Record<string, Record<string, string>> = {
  Maharashtra: {
    Maharashtra: 'SAME_STATE',
    Gujarat: 'SHORT',
    Karnataka: 'SHORT',
    Goa: 'SHORT',
    Delhi: 'MEDIUM',
    'Tamil Nadu': 'LONG',
    'West Bengal': 'LONG',
  },
  Gujarat: {
    Gujarat: 'SAME_STATE',
    Maharashtra: 'SHORT',
    Rajasthan: 'SHORT',
    Delhi: 'MEDIUM',
    Karnataka: 'MEDIUM',
  },
  Karnataka: {
    Karnataka: 'SAME_STATE',
    Maharashtra: 'SHORT',
    Goa: 'SHORT',
    'Tamil Nadu': 'SHORT',
    Kerala: 'SHORT',
    'Andhra Pradesh': 'SHORT',
  },
  Delhi: {
    Delhi: 'SAME_STATE',
    Haryana: 'SHORT',
    'Uttar Pradesh': 'SHORT',
    Punjab: 'SHORT',
    Rajasthan: 'SHORT',
    Maharashtra: 'MEDIUM',
    Gujarat: 'MEDIUM',
  },
  // Add more states as needed
};

function getDistanceMultiplier(pickupState: string, deliveryState: string): number {
  if (pickupState === deliveryState) {
    return PRICING_MULTIPLIERS.distance.SAME_STATE;
  }

  const distanceType =
    STATE_DISTANCES[pickupState]?.[deliveryState] ||
    STATE_DISTANCES[deliveryState]?.[pickupState] ||
    'MEDIUM'; // Default to medium if not mapped

  return PRICING_MULTIPLIERS.distance[distanceType as keyof typeof PRICING_MULTIPLIERS.distance] || 1.3;
}

function getQuantityMultiplier(quantity: number): number {
  const range = PRICING_MULTIPLIERS.quantity.ranges.find(
    (r) => quantity >= r.min && quantity < r.max
  );
  return range?.multiplier || 1.0;
}

function getVehicleMultiplier(vehicleTypes: VehicleType[]): number {
  if (vehicleTypes.length === 0) return 1.0;

  // Use the highest multiplier if multiple vehicle types
  const multipliers = vehicleTypes.map(
    (vt) => PRICING_MULTIPLIERS.vehicle[vt] || 1.0
  );
  return Math.max(...multipliers);
}

export function calculateLeadCost(params: PricingParams): number {
  let cost = BASE_LEAD_COST;

  // Apply hazard multiplier
  const hazardKey = params.hazardClass || 'NON_HAZARDOUS';
  cost *= PRICING_MULTIPLIERS.hazard[hazardKey];

  // Apply distance multiplier
  cost *= getDistanceMultiplier(params.pickupState, params.deliveryState);

  // Apply quantity multiplier
  cost *= getQuantityMultiplier(params.quantity);

  // Apply vehicle multiplier
  cost *= getVehicleMultiplier(params.vehicleType);

  // Apply urgency multiplier
  if (params.isUrgent) {
    cost *= PRICING_MULTIPLIERS.urgency;
  }

  // Apply subscription tier discount
  cost *= PRICING_MULTIPLIERS.tier[params.subscriptionTier];

  // Round to 2 decimal places
  return Math.round(cost * 100) / 100;
}

export function getLeadType(subscriptionTier: SubscriptionTier): 'EXCLUSIVE' | 'SHARED' {
  return subscriptionTier === SubscriptionTier.PREMIUM ? 'EXCLUSIVE' : 'SHARED';
}

export function estimateLeadCostForQuote(quote: any): number {
  return calculateLeadCost({
    hazardClass: quote.hazardClass,
    quantity: quote.quantity,
    pickupState: quote.pickupState,
    deliveryState: quote.deliveryState,
    vehicleType: quote.preferredVehicleType || [],
    subscriptionTier: SubscriptionTier.STANDARD, // Default estimate for standard tier
    isUrgent: false,
  });
}
