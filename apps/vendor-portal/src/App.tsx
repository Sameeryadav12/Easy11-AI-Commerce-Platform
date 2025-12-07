import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@web/contexts/ThemeContext';
import VendorDashboard from '@web/pages/vendor/VendorDashboard';
import VendorProducts from '@web/pages/vendor/VendorProducts';
import VendorProductWizard from '@web/pages/vendor/VendorProductWizard';
import VendorOrders from '@web/pages/vendor/VendorOrders';
import VendorAnalyticsPage from '@web/pages/vendor/VendorAnalyticsPage';
import VendorMarketingAIPage from '@web/pages/vendor/VendorMarketingAIPage';
import VendorMarketingCommandCenter from '@web/pages/vendor/VendorMarketingCommandCenter';
import VendorGrowthOpsPage from '@web/pages/vendor/VendorGrowthOpsPage';
import VendorMobileOpsPage from '@web/pages/vendor/VendorMobileOpsPage';
import VendorSettingsPage from '@web/pages/vendor/VendorSettingsPage';
import VendorKYCPage from '@web/pages/vendor/VendorKYCPage';
import VendorLoginPage from '@web/pages/vendor/VendorLoginPage';
import VendorRegisterPage from '@web/pages/vendor/VendorRegisterPage';
import VendorLayoutShell from './components/VendorLayoutShell';
import { useEffect } from 'react';

function VendorAppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
      <Route path="/vendor/login" element={<VendorLoginPage />} />
      <Route path="/vendor/register" element={<VendorRegisterPage />} />
      <Route element={<VendorLayoutShell />}>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/products/new" element={<VendorProductWizard />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />
        <Route path="/vendor/analytics" element={<VendorAnalyticsPage />} />
        <Route path="/vendor/marketing/ai" element={<VendorMarketingAIPage />} />
        <Route path="/vendor/marketing/launch" element={<VendorMarketingCommandCenter />} />
        <Route path="/vendor/growth" element={<VendorGrowthOpsPage />} />
        <Route path="/vendor/mobile" element={<VendorMobileOpsPage />} />
        <Route path="/vendor/settings" element={<VendorSettingsPage />} />
        <Route path="/vendor/kyc" element={<VendorKYCPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    const id = setInterval(() => {
      const evt = {
        service: 'vendor.portal',
        domain: 'infra',
        severity: 'info',
        message: 'heartbeat',
        timestamp: new Date().toISOString(),
      };
      // eslint-disable-next-line no-console
      console.log('[Easy11::OpsEvent]', JSON.stringify(evt));
      // best-effort POST to admin ops endpoint
      fetch('http://localhost:3001/api/ops/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evt),
        mode: 'cors',
      }).catch(() => {});
    }, 5000);
    const latencyId = setInterval(() => {
      const metric = {
        service: 'vendor.portal',
        domain: 'traffic',
        metric: 'latency_ms',
        value: Math.round(100 + Math.random() * 60 + (Math.random() < 0.12 ? 300 : 0)),
        timestamp: new Date().toISOString(),
        severity: 'info',
        message: 'metric',
      };
      // eslint-disable-next-line no-console
      console.log('[Easy11::OpsMetric]', JSON.stringify(metric));
      fetch('http://localhost:3001/api/ops/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
        mode: 'cors',
      }).catch(() => {});
    }, 6500);

    const errorId = setInterval(() => {
      const metric = {
        service: 'vendor.portal',
        domain: 'traffic',
        metric: 'error_rate_pct',
        value: parseFloat(((Math.random() * 1.2) + (Math.random() < 0.08 ? Math.random() * 9 : 0)).toFixed(2)),
        timestamp: new Date().toISOString(),
        severity: 'info',
        message: 'metric',
      };
      // eslint-disable-next-line no-console
      console.log('[Easy11::OpsMetric]', JSON.stringify(metric));
      fetch('http://localhost:3001/api/ops/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
        mode: 'cors',
      }).catch(() => {});
    }, 9000);

    return () => {
      clearInterval(id);
      clearInterval(latencyId);
      clearInterval(errorId);
    };
  }, []);
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <VendorAppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
