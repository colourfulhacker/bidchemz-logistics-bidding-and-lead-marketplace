import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardBody, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/contexts/AuthContext';

interface WalletData {
  balance: number;
  currency: string;
  lowBalanceAlert: boolean;
  alertThreshold: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  transactionType: string;
  amount: number;
  description: string;
  transactionDate: string;
  leadId?: string;
}

export default function PartnerWallet() {
  const { user, token } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [lowBalanceAlert, setLowBalanceAlert] = useState(true);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchWallet();
    }
  }, [token]);

  const fetchWallet = async () => {
    try {
      const response = await fetch('/api/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setWallet(data.wallet);
        setAlertThreshold(data.wallet.alertThreshold.toString());
        setLowBalanceAlert(data.wallet.lowBalanceAlert);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, paymentMethod: 'Online' }),
      });

      if (response.ok) {
        setRechargeAmount('');
        setShowRechargeModal(false);
        fetchWallet();
      } else {
        const data = await response.json();
        alert(data.error || 'Recharge failed');
      }
    } catch (error) {
      alert('Recharge failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateSettings = async () => {
    const threshold = parseFloat(alertThreshold);
    if (isNaN(threshold) || threshold < 0) {
      alert('Please enter a valid threshold');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/wallet/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          lowBalanceAlert,
          alertThreshold: threshold,
        }),
      });

      if (response.ok) {
        alert('Settings updated successfully');
        fetchWallet();
      } else {
        const data = await response.json();
        alert(data.error || 'Update failed');
      }
    } catch (error) {
      alert('Update failed');
    } finally {
      setProcessing(false);
    }
  };

  if (!user || user.role !== 'LOGISTICS_PARTNER') {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Access denied. Partners only.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const isLowBalance = wallet && wallet.lowBalanceAlert && wallet.balance <= wallet.alertThreshold;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Lead Wallet</h1>

        {isLowBalance && (
          <Alert variant="warning" className="mb-6">
            ⚠️ Low balance alert! Your current balance (₹{wallet?.balance.toLocaleString()}) is below your threshold (₹{wallet?.alertThreshold.toLocaleString()}). Please recharge to continue receiving leads.
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="text-center py-6">
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  ₹{wallet?.balance.toLocaleString() || '0'}
                </p>
                <p className="text-gray-600">Available Credits</p>
                <Button
                  variant="primary"
                  className="mt-6"
                  onClick={() => setShowRechargeModal(true)}
                >
                  Recharge Wallet
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowBalanceAlert"
                    checked={lowBalanceAlert}
                    onChange={(e) => setLowBalanceAlert(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lowBalanceAlert" className="ml-2 text-sm text-gray-700">
                    Low balance alerts
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={alertThreshold}
                    onChange={(e) => setAlertThreshold(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="100"
                  />
                </div>

                <Button
                  variant="secondary"
                  onClick={handleUpdateSettings}
                  disabled={processing}
                  className="w-full"
                >
                  Update Settings
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wallet?.transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          transaction.transactionType === 'RECHARGE'
                            ? 'bg-green-100 text-green-800'
                            : transaction.transactionType === 'DEBIT'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={transaction.transactionType === 'RECHARGE' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.transactionType === 'RECHARGE' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {showRechargeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Recharge Wallet</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recharge Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="100"
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[1000, 5000, 10000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setRechargeAmount(amount.toString())}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      onClick={() => setShowRechargeModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleRecharge}
                      disabled={processing || !rechargeAmount}
                      className="flex-1"
                    >
                      {processing ? 'Processing...' : 'Recharge'}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
