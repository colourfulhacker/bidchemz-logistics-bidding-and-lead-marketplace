import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'LOGISTICS_PARTNER') {
        router.push('/partner/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BidChemz Logistics
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Reverse Bidding Platform for Chemical Logistics
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            <Card>
              <h2 className="text-2xl font-semibold mb-4">For Traders</h2>
              <p className="text-gray-600 mb-6">
                Submit freight requests and receive competitive quotations from verified logistics partners
              </p>
              <Link href="/signup">
                <Button variant="primary" className="w-full">
                  Get Started
                </Button>
              </Link>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold mb-4">For Logistics Partners</h2>
              <p className="text-gray-600 mb-6">
                Receive high-quality leads and submit competitive offers to win freight business
              </p>
              <Link href="/signup">
                <Button variant="primary" className="w-full">
                  Join as Partner
                </Button>
              </Link>
            </Card>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold mb-2">Submit Request</h4>
                <p className="text-sm text-gray-600">Trader submits freight requirement</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold mb-2">Match Partners</h4>
                <p className="text-sm text-gray-600">System matches eligible partners</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold mb-2">Receive Offers</h4>
                <p className="text-sm text-gray-600">Partners submit competitive quotes</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <h4 className="font-semibold mb-2">Select & Track</h4>
                <p className="text-sm text-gray-600">Choose best offer and track shipment</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user.companyName || user.email}!
        </h1>

        {user.role === 'TRADER' && (
          <div>
            <Card>
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/quotes/new">
                  <Button variant="primary" className="w-full">
                    Create New Freight Request
                  </Button>
                </Link>
                <Link href="/quotes">
                  <Button variant="secondary" className="w-full">
                    View My Requests
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
