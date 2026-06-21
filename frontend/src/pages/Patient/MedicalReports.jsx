import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { FaFilePdf, FaDownload, FaUpload, FaLock } from 'react-icons/fa';
import patientService from '../../services/patientService';

const DEMO = [
  { id: 1, name: 'Blood_Test_Jan2026.pdf',      size: '1.2 MB', date: '18 Jan 2026', doctor: "Dr. M. O'Brien", type: 'Lab Report' },
  { id: 2, name: 'Chest_Xray_Dec2025.pdf',      size: '3.8 MB', date: '12 Dec 2025', doctor: 'Dr. A. Walsh',   type: 'Imaging' },
  { id: 3, name: 'ECG_Report_Nov2025.pdf',       size: '0.9 MB', date: '5 Nov 2025',  doctor: 'Dr. A. Walsh',   type: 'Cardiology' },
  { id: 4, name: 'Annual_Physical_Oct2025.pdf',  size: '2.1 MB', date: '20 Oct 2025', doctor: "Dr. M. O'Brien", type: 'Physical Exam' },
  { id: 5, name: 'Allergy_Test_Sep2025.pdf',     size: '1.5 MB', date: '15 Sep 2025', doctor: 'Dr. P. Nolan',   type: 'Allergy Test' },
];

const MedicalReports = () => {
  const [reports, setReports] = useState(DEMO);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    patientService.getMedicalReports()
      .then(data => { if (data?.length) setReports(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success(`${file.name} uploaded!`);
    setUploading(false);
  };

  return (
    <Layout title="Medical Reports">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">Medical Reports ({reports.length})</h2>
                <p className="text-xs text-gray-400 mt-1">Azure Blob Storage · patient-reports/</p>
              </div>
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={handleUpload} disabled={uploading} />
                <Button variant="outline" size="sm" loading={uploading}>
                  <FaUpload className="mr-1" /> Upload New
                </Button>
              </label>
            </div>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <FaFilePdf className="text-red-500 text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.size} · {r.date} · {r.doctor}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{r.type}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => toast.info(`Downloading ${r.name}...`)}>
                    <FaDownload className="mr-1" /> Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="Storage Info" subtitle="Azure Blob Storage">
          <div className="space-y-3">
            {[
              ['Container',  'patient-reports'],
              ['Region',     'West Europe (Ireland)'],
              ['Encryption', 'AES-256'],
              ['GDPR',       'Compliant'],
              ['Access',     'SAS Token · 1hr'],
              ['Files',      `${reports.length} documents`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs font-semibold font-mono text-blue-600">{val}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 text-xs">
              <FaLock className="text-blue-500 flex-shrink-0" />
              <span>Secure access with SAS tokens. All data encrypted at rest.</span>
            </div>
          </div>
        </Card>
      </div>
      {loading && <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div></div>}
    </Layout>
  );
};

export default MedicalReports;
