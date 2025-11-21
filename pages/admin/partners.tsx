import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import { useRouter } from 'next/router';

export default function AdminPartners() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchPartners();
  }, [user]);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/admin/users?filter=partners', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPartners(data.data || data || []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchPartners();
        alert(currentStatus ? 'Partner deactivated' : 'Partner activated');
      }
    } catch (error) {
      console.error('Error updating partner:', error);
      alert('Failed to update partner');
    }
  };

  if (loading) return <Layout><div className="text-center py-12">Loading partners...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Manage Logistics Partners</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Company</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Contact Email</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Phone</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Verified</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No logistics partners found
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{partner.companyName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{partner.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{partner.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          partner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {partner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {partner.isVerified ? '✓ Yes' : '✗ No'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => toggleActive(partner.id, partner.isActive)}
                          className={`px-3 py-1 text-white text-xs rounded ${
                            partner.isActive 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {partner.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
