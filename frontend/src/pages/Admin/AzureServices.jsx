import React from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const AzureServices = () => {
  const services = [
    {
      title: 'Azure SQL Database',
      details: ['Server: smartcare-sqlserver', 'DB: SmartCareDB', 'Region: West Europe', 'Tier: Basic (S0)', 'Tables: 6 · Records: 285'],
      action: 'Ping DB',
    },
    {
      title: 'App Service',
      details: ['URL: smartcare-api.azurewebsites.net', 'Runtime: Node.js 18', 'Plan: Free F1', 'Region: West Europe', 'Status: Running'],
      action: 'Health Check',
    },
    {
      title: 'Blob Storage',
      details: ['Account: smartcarestorage', 'Container: patient-reports', 'Files: 7 · Size: 6.4 MB', 'Encryption: AES-256', 'GDPR: Compliant'],
      action: 'Check Storage',
    },
    {
      title: 'Azure AD B2C',
      details: ['Tenant: SmartCareB2C', 'Roles: Patient/Doctor/Admin', 'Users: 158 registered', 'MFA: Enabled', 'JWT: 1hr expiry'],
      action: null,
    },
    {
      title: 'Communication Services',
      details: ['Video: WebRTC · ACS SDK', 'Email: Azure Email service', 'SMS: Azure Communication', 'Reminders: CRON-based', 'Status: Ready'],
      action: null,
    },
    {
      title: 'Key Vault',
      details: ['Vault: smartcare-vault', 'Secrets: 8 stored', 'DB connection string ✓', 'Storage key ✓', 'ACS key ✓'],
      action: null,
    },
  ];

  return (
    <Layout title="Azure Services">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, idx) => (
          <Card key={idx}>
            <h3 className="font-semibold text-blue-600 text-sm uppercase tracking-wide mb-3">{svc.title}</h3>
            <div className="space-y-1 mb-4">
              {svc.details.map((d, i) => (
                <div key={i} className="text-xs text-gray-600">{d}</div>
              ))}
            </div>
            {svc.action && (
              <Button size="sm" variant="outline" fullWidth onClick={() => toast.success(`${svc.action} — OK`)}>
                {svc.action}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default AzureServices;
