import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { UserRole } from '@prisma/client';

export default function Signup() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '' as UserRole | '',
    companyName: '',
    gstin: '',
  });
  const [consents, setConsents] = useState({
    termsOfService: false,
    privacyPolicy: false,
    partnerPolicy: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsents({
      ...consents,
      [e.target.name]: e.target.checked,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    if (!consents.termsOfService) {
      setError('You must accept the Terms of Service to continue');
      setLoading(false);
      return;
    }

    if (!consents.privacyPolicy) {
      setError('You must accept the Privacy Policy to continue');
      setLoading(false);
      return;
    }

    if (formData.role === UserRole.LOGISTICS_PARTNER && !consents.partnerPolicy) {
      setError('Logistics Partners must accept the Partner Policy to continue');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signupData,
          consents: {
            termsOfService: consents.termsOfService,
            privacyPolicy: consents.privacyPolicy,
            partnerPolicy: formData.role === UserRole.LOGISTICS_PARTNER ? consents.partnerPolicy : undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Signup successful - login with the returned token
      localStorage.setItem('token', data.token);
      router.push('/');
      window.location.reload(); // Force reload to refresh auth state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">BidChemz Logistics</h1>
          <h2 className="text-xl text-gray-900">Create your account</h2>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Select
              label="I am a"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { label: 'Select your role', value: '' },
                { label: 'Chemical Trader', value: UserRole.TRADER },
                { label: 'Logistics Partner', value: UserRole.LOGISTICS_PARTNER },
              ]}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />

            <Input
              label="Company Name"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your Company Ltd."
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
            />

            <Input
              label="GSTIN (Optional)"
              type="text"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
            />

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700">Required Agreements</p>
              
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsOfService"
                  checked={consents.termsOfService}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/policies/terms" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                    Terms of Service
                  </Link>
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyPolicy"
                  checked={consents.privacyPolicy}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/policies/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {formData.role === UserRole.LOGISTICS_PARTNER && (
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="partnerPolicy"
                    checked={consents.partnerPolicy}
                    onChange={handleCheckboxChange}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/policies/partner" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                      Logistics Partner Policy
                    </Link>{' '}
                    <span className="text-red-600">*</span>
                  </span>
                </label>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
