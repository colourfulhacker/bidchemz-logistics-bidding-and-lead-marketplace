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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Chemical Logistics,<br />
                <span className="text-blue-200">Simplified</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                India's first reverse-bidding platform connecting chemical traders with verified logistics partners
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup">
                  <button className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Get Started Free
                  </button>
                </Link>
                <Link href="/login">
                  <button className="inline-flex items-center justify-center bg-blue-800 bg-opacity-50 text-white hover:bg-opacity-70 px-8 py-4 text-lg font-semibold border border-blue-400 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="relative bg-blue-800 bg-opacity-50 border-t border-blue-500">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-blue-200 text-sm mt-1">Verified Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">10,000+</div>
                  <div className="text-blue-200 text-sm mt-1">Shipments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">DG 1-9</div>
                  <div className="text-blue-200 text-sm mt-1">All Hazard Classes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-blue-200 text-sm mt-1">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-gray-600">
              Select the option that best describes you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Trader Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
              <Card className="relative border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-2xl p-8">
                <div className="flex items-start mb-6">
                  <div className="bg-blue-100 p-4 rounded-xl">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">For Traders</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Post freight requirements and receive competitive quotations from pre-verified logistics partners in minutes
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Compare multiple offers instantly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">All DG classes supported</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Real-time shipment tracking</span>
                  </li>
                </ul>

                <Link href="/signup">
                  <Button variant="primary" className="w-full py-3 text-lg font-semibold">
                    Start as Trader
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Partner Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition"></div>
              <Card className="relative border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-2xl p-8">
                <div className="flex items-start mb-6">
                  <div className="bg-purple-100 p-4 rounded-xl">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">For Logistics Partners</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Access high-quality freight leads matched to your capabilities and win business with competitive quotes
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Qualified leads only</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Capability-based matching</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Transparent pricing model</span>
                  </li>
                </ul>

                <Link href="/signup">
                  <Button className="w-full py-3 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white">
                    Join as Partner
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Simple, transparent, and efficient logistics procurement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Submit Request</h4>
                  <p className="text-sm text-gray-600">
                    Trader posts freight details with all specifications
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300" style={{ width: 'calc(100% - 4rem)' }}></div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Auto-Match</h4>
                  <p className="text-sm text-gray-600">
                    System matches eligible partners based on capabilities
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300" style={{ width: 'calc(100% - 4rem)' }}></div>
              </div>

              <div className="relative">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Get Quotes</h4>
                  <p className="text-sm text-gray-600">
                    Partners submit competitive quotations in real-time
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300" style={{ width: 'calc(100% - 4rem)' }}></div>
              </div>

              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900">Select & Track</h4>
                <p className="text-sm text-gray-600">
                  Choose best offer and track shipment end-to-end
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BidChemz
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-xl transition">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Partners</h3>
              <p className="text-gray-600">
                All logistics partners are pre-verified with valid DG licenses and certifications
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Get competitive quotes within minutes, not days. Automated matching saves time
              </p>
            </Card>

            <Card className="p-6 hover:shadow-xl transition">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                Clear lead pricing with no hidden charges. Pay only for successful bookings
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of traders and logistics partners already using BidChemz
            </p>
            <Link href="/signup">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl">
                Get Started Free
              </Button>
            </Link>
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
