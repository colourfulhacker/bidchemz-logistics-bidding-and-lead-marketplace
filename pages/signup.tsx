import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import { UserRole } from '@prisma/client';
import PolicyAcceptanceModal from '@/components/PolicyAcceptanceModal';

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
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'partner' | null>(null);
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
              autoComplete="email"
            />

            <Input
              label="Company Name"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your Company Ltd."
              autoComplete="organization"
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              autoComplete="tel"
            />

            <Input
              label="GSTIN (Optional)"
              type="text"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
              autoComplete="off"
            />

            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              autoComplete="new-password"
              showRequirements={true}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              autoComplete="new-password"
              error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
            />

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Required Agreements <span className="text-red-600">*</span>
              </p>
              <p className="text-xs text-gray-600 mb-4">
                You must read and accept each policy before creating your account
              </p>
              
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 border rounded-lg ${consents.termsOfService ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                  <div className="flex items-center space-x-2">
                    {consents.termsOfService ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${consents.termsOfService ? 'text-green-800' : 'text-gray-700'}`}>
                      Terms of Service
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal('terms')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {consents.termsOfService ? 'Review' : 'Read & Accept'}
                  </button>
                </div>

                <div className={`flex items-center justify-between p-3 border rounded-lg ${consents.privacyPolicy ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                  <div className="flex items-center space-x-2">
                    {consents.privacyPolicy ? (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${consents.privacyPolicy ? 'text-green-800' : 'text-gray-700'}`}>
                      Privacy Policy
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {consents.privacyPolicy ? 'Review' : 'Read & Accept'}
                  </button>
                </div>

                {formData.role === UserRole.LOGISTICS_PARTNER && (
                  <div className={`flex items-center justify-between p-3 border rounded-lg ${consents.partnerPolicy ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-400'}`}>
                    <div className="flex items-center space-x-2">
                      {consents.partnerPolicy ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`text-sm font-medium ${consents.partnerPolicy ? 'text-green-800' : 'text-amber-800'}`}>
                        Logistics Partner Policy <span className="text-red-600">*Required</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal('partner')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {consents.partnerPolicy ? 'Review' : 'Read & Accept'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <PolicyAcceptanceModal
              isOpen={activeModal === 'terms'}
              policyType="terms"
              onAccept={() => {
                setConsents({ ...consents, termsOfService: true });
                setActiveModal(null);
              }}
              onDecline={() => setActiveModal(null)}
              requireScroll={true}
            />

            <PolicyAcceptanceModal
              isOpen={activeModal === 'privacy'}
              policyType="privacy"
              onAccept={() => {
                setConsents({ ...consents, privacyPolicy: true });
                setActiveModal(null);
              }}
              onDecline={() => setActiveModal(null)}
              requireScroll={true}
            />

            <PolicyAcceptanceModal
              isOpen={activeModal === 'partner'}
              policyType="partner"
              onAccept={() => {
                setConsents({ ...consents, partnerPolicy: true });
                setActiveModal(null);
              }}
              onDecline={() => setActiveModal(null)}
              requireScroll={true}
            />

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
