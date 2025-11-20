import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function AdminPricingConfig() {
  const { user } = useAuth();
  const router = useRouter();
  const [pricing, setPricing] = useState({
    baseLeadCost: 100,
    hazardMultipliers: {
      CLASS_1: 3.0,
      CLASS_2: 2.5,
      CLASS_3: 2.0,
      CLASS_4: 1.8,
      CLASS_5: 1.5,
      CLASS_6: 1.7,
      CLASS_7: 1.3,
      CLASS_8: 2.2,
      CLASS_9: 1.4,
    },
    distanceMultipliers: {
      local: 1.0,
      intracity: 1.2,
      interstate: 1.5,
      international: 2.5,
    },
    subscriptionDiscounts: {
      FREE: 0,
      BASIC: 10,
      PRO: 20,
      ENTERPRISE: 30,
    },
  });

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, router]);

  if (user?.role !== 'ADMIN') {
    return null;
  }

  const handleSave = async () => {
    alert('Pricing configuration saved! (In production, this would update the database)');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Lead Pricing Configuration
          </h1>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Base Lead Cost
              </h2>
              <input
                type="number"
                value={pricing.baseLeadCost}
                onChange={(e) =>
                  setPricing({ ...pricing, baseLeadCost: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Base cost in ₹ before applying multipliers
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Hazard Class Multipliers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(pricing.hazardMultipliers).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={value}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          hazardMultipliers: {
                            ...pricing.hazardMultipliers,
                            [key]: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Distance Multipliers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(pricing.distanceMultipliers).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={value}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          distanceMultipliers: {
                            ...pricing.distanceMultipliers,
                            [key]: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Subscription Discounts (%)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(pricing.subscriptionDiscounts).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {key}
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setPricing({
                          ...pricing,
                          subscriptionDiscounts: {
                            ...pricing.subscriptionDiscounts,
                            [key]: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
