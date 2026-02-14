import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Phone, Building, LogOut, Settings } from 'lucide-react';
import { db } from '../lib/db';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'bn', label: 'বাংলা (Bengali)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
];

export const Profile: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [profile] = useState({
    name: 'Instructor Kumar',
    id: 'NDMA-2024-001',
    phone: '+91 98765 43210',
    organization: 'NDMA',
    role: 'Ground Staff Instructor',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedLanguage = await db.getSetting('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    await db.setSetting('language', newLanguage);
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear all cached data? This will remove offline data.')) {
      return;
    }

    // In production, implement proper cache clearing
    alert('Cache cleared successfully');
  };

  return (
    <Layout title="Profile">
      <div className="space-y-4 pb-4">
        {/* Profile Card */}
        <Card elevated>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indian-blue to-govt-blue flex items-center justify-center text-4xl text-white mb-3">
              {profile.name.charAt(0)}
            </div>
            <h2 className="text-card-title font-bold">{profile.name}</h2>
            <p className="text-small text-gray-600 mb-1">{profile.role}</p>
            <p className="text-micro text-gray-500">{profile.id}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-body">
              <Phone size={20} className="text-gray-400" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-body">
              <Building size={20} className="text-gray-400" />
              <span>{profile.organization}</span>
            </div>
          </div>
        </Card>

        {/* Settings Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-indian-blue" />
            <h3 className="text-card-title font-semibold">Settings</h3>
          </div>

          <div className="space-y-4">
            <Select
              label="Language"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              options={languages}
            />

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">
                Notifications
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-body">Enable notifications</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">
                GPS Accuracy
              </label>
              <Select
                value="high"
                onChange={() => { }}
                options={[
                  { value: 'high', label: 'High (Uses more battery)' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low (Saves battery)' },
                ]}
              />
            </div>

            <div>
              <label className="block text-small font-medium text-gray-700 mb-2">
                Auto-sync
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-body">Sync when online</span>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <h3 className="text-card-title font-semibold mb-4">Data Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body font-medium">Storage Used</p>
                <p className="text-small text-gray-600">Approximately 45 MB</p>
              </div>
            </div>
            <Button
              variant="danger"
              onClick={handleClearCache}
              fullWidth
            >
              Clear Cache
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card>
          <h3 className="text-card-title font-semibold mb-4">About</h3>
          <div className="space-y-2 text-small">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Team</span>
              <span className="font-medium">GeoVision</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Competition</span>
              <span className="font-medium">SIH 2025</span>
            </div>
          </div>
        </Card>

        {/* Help & Support */}
        <Card>
          <h3 className="text-card-title font-semibold mb-3">Help & Support</h3>
          <p className="text-small text-gray-600 mb-3">
            Need assistance? Contact our support team.
          </p>
          <Button variant="secondary" fullWidth>
            Contact Support
          </Button>
        </Card>

        {/* Logout */}
        <Button
          icon={LogOut}
          variant="danger"
          onClick={() => alert('Logout functionality')}
          fullWidth
        >
          Logout
        </Button>
      </div>
    </Layout>
  );
};
