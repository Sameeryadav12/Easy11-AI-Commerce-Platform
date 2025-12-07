import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollToTop from './components/navigation/ScrollToTop';
import { startHeartbeat, startMetricProbes } from './lib/opsEvents';
import React from 'react';
import Layout from './components/Layout';
import VendorLayout from './components/vendor/VendorLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailWorking from './pages/ProductDetailWorking';
import FullCartPage from './pages/FullCartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingPage from './pages/ShippingPage';
import TrackOrderPage from './pages/TrackOrderPage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import NewLogin from './pages/NewLogin';
import NewRegister from './pages/NewRegister';
import ComponentShowcase from './pages/ComponentShowcase';

// New Auth Pages (OWASP/NIST Compliant)
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import VerificationSentPage from './pages/auth/VerificationSentPage';

// MFA Pages (Sprint 2)
import MFAEnrollPage from './pages/mfa/MFAEnrollPage';
import MFAVerifyPage from './pages/mfa/MFAVerifyPage';
import RecoveryCodesPage from './pages/mfa/RecoveryCodesPage';

// Account Pages
import AccountLayout from './components/account/AccountLayout';
import DashboardPage from './pages/account/DashboardPage';
import OrdersPage from './pages/account/OrdersPage';
import WishlistPage from './pages/account/WishlistPage';
import RewardsPage from './pages/account/RewardsPage';
import ReferralsPage from './pages/account/ReferralsPage';
import RewardsChallengesPage from './pages/account/RewardsChallengesPage';
import RewardsHistoryPage from './pages/account/RewardsHistoryPage';
import ContributionsPage from './pages/account/ContributionsPage';
import SecurityPage from './pages/account/SecurityPage';
import AddressesPage from './pages/account/AddressesPage';
import PaymentsPage from './pages/account/PaymentsPage';
import NotificationsPage from './pages/account/NotificationsPage';
import PrivacyPage from './pages/account/PrivacyPage';

// Vendor Pages (Sprint 7)
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorAnalyticsPage from './pages/vendor/VendorAnalyticsPage';
import VendorSettingsPage from './pages/vendor/VendorSettingsPage';
import VendorKYCPage from './pages/vendor/VendorKYCPage';
import VendorRegisterPage from './pages/vendor/VendorRegisterPage';
import VendorLoginPage from './pages/vendor/VendorLoginPage';
import VendorMarketingAIPage from './pages/vendor/VendorMarketingAIPage';
import VendorMarketingCommandCenter from './pages/vendor/VendorMarketingCommandCenter';
import VendorGrowthOpsPage from './pages/vendor/VendorGrowthOpsPage';
import VendorMobileOpsPage from './pages/vendor/VendorMobileOpsPage';
import VendorProductWizard from './pages/vendor/VendorProductWizard';
import CommunityHubPage from './pages/community/CommunityHubPage';
import LookDetailPage from './pages/community/LookDetailPage';

function StorefrontShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AccountShell() {
  return (
    <AccountLayout>
      <Outlet />
    </AccountLayout>
  );
}

function VendorShell() {
  return (
    <VendorLayout>
      <Outlet />
    </VendorLayout>
  );
}

function App() {
  React.useEffect(() => {
    const stopHeartbeat = startHeartbeat('customer.web');
    const stopMetrics = startMetricProbes('customer.web');
    return () => {
      stopHeartbeat();
      stopMetrics();
    };
  }, []);
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<StorefrontShell />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailWorking />} />
            <Route path="cart" element={<FullCartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/confirmation" element={<OrderConfirmationPage />} />
            <Route path="community" element={<CommunityHubPage />} />
            <Route path="community/looks/:id" element={<LookDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="shipping" element={<ShippingPage />} />
            <Route path="track-order" element={<TrackOrderPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="cookies" element={<CookiePolicyPage />} />
            <Route path="accessibility" element={<AccessibilityPage />} />
            <Route path="auth/register" element={<RegisterPage />} />
            <Route path="auth/login" element={<LoginPage />} />
            <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="auth/verify-email" element={<VerifyEmailPage />} />
            <Route path="auth/verification-sent" element={<VerificationSentPage />} />
            <Route path="auth/mfa/enroll" element={<MFAEnrollPage />} />
            <Route path="auth/mfa/verify" element={<MFAVerifyPage />} />
            <Route path="auth/mfa/recovery-codes" element={<RecoveryCodesPage />} />
            <Route path="login" element={<NewLogin />} />
            <Route path="register" element={<NewRegister />} />
            <Route path="components" element={<ComponentShowcase />} />
          </Route>

          <Route path="/account" element={<AccountShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="rewards/challenges" element={<RewardsChallengesPage />} />
            <Route path="rewards/history" element={<RewardsHistoryPage />} />
            <Route path="contributions" element={<ContributionsPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="profile" element={<DashboardPage />} />
            <Route path="returns" element={<DashboardPage />} />
            <Route path="settings" element={<DashboardPage />} />
            <Route path="support" element={<DashboardPage />} />
          </Route>

          <Route path="/vendor/register" element={<VendorRegisterPage />} />
          <Route path="/vendor/login" element={<VendorLoginPage />} />

          <Route path="/vendor" element={<VendorShell />}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="products/new" element={<VendorProductWizard />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="analytics" element={<VendorAnalyticsPage />} />
            <Route path="marketing/ai" element={<VendorMarketingAIPage />} />
            <Route path="marketing/launch" element={<VendorMarketingCommandCenter />} />
            <Route path="growth" element={<VendorGrowthOpsPage />} />
            <Route path="mobile" element={<VendorMobileOpsPage />} />
            <Route path="settings" element={<VendorSettingsPage />} />
            <Route path="kyc" element={<VendorKYCPage />} />
          </Route>
        </Routes>

        <Toaster position="top-right" />
      </Router>
    </ThemeProvider>
  );
}

export default App;
