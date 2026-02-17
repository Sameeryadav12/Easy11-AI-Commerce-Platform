import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollToTop from './components/navigation/ScrollToTop';
import { startHeartbeat, startMetricProbes } from './lib/opsEvents';
import React from 'react';
import { useAuthStore } from './store/authStore';
import { setCurrentUserScope } from './store/userScopedStorage';
import { useCartStore } from './store/cartStore';
import { useWishlistStore } from './store/wishlistStore';
import { useRewardsStore } from './store/rewardsStore';
import { useAddressStore } from './store/addressStore';
import { usePaymentStore } from './store/paymentStore';
import { useRecentlyViewedStore } from './store/recentlyViewedStore';
import { useMFAStore } from './store/mfaStore';
import { useNotificationStore } from './store/notificationStore';
import { useOrdersStore } from './store/ordersStore';
import { useReturnsStore } from './store/returnsStore';
import { useSupportTicketsStore } from './store/supportTicketsStore';
import { useCustomerSettingsStore } from './store/settingsStore';
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
import SupportCategoryPage from './pages/SupportCategoryPage';
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
import OrderDetailsPage from './pages/account/OrderDetailsPage';
import WishlistPage from './pages/account/WishlistPage';
import RewardsPage from './pages/account/RewardsPage';
import ReferralsPage from './pages/account/ReferralsPage';
import RewardsChallengesPage from './pages/account/RewardsChallengesPage';
import RewardsHistoryPage from './pages/account/RewardsHistoryPage';
import RedemptionsPage from './pages/account/RedemptionsPage';
import RewardsHubLayout from './pages/account/RewardsHubLayout';
import ContributionsPage from './pages/account/ContributionsPage';
import SecurityPage from './pages/account/SecurityPage';
import AddressesPage from './pages/account/AddressesPage';
import PaymentsPage from './pages/account/PaymentsPage';
import NotificationsPage from './pages/account/NotificationsPage';
import PrivacyPage from './pages/account/PrivacyPage';
import SettingsPage from './pages/account/SettingsPage';
import SupportCenterPage from './pages/account/SupportCenterPage';
import SupportTicketsPage from './pages/account/SupportTicketsPage';
import ReturnsRefundsPage from './pages/account/ReturnsRefundsPage';
import ProfileSecurityPage from './pages/account/ProfileSecurityPage';

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
  const userId = useAuthStore((s) => s.user?.id || null);

  React.useEffect(() => {
    // Account-based persistence (Amazon/eBay model):
    // Set scope FIRST so rehydrate reads from the correct user's storage key.
    setCurrentUserScope(userId);

    // Rehydrate all user-scoped stores (they use skipHydration - we control when they load).
    // Logout = scope 'anon' → empty data. Login = scope userId → that user's saved data.
    const rehydrate = (store: any) => store?.persist?.rehydrate?.();
    try {
      rehydrate(useCartStore);
      rehydrate(useWishlistStore);
      rehydrate(useRewardsStore);
      rehydrate(useAddressStore);
      rehydrate(usePaymentStore);
      rehydrate(useRecentlyViewedStore);
      rehydrate(useReturnsStore);
      rehydrate(useMFAStore);
      rehydrate(useNotificationStore);
      rehydrate(useSupportTicketsStore);
      rehydrate(useCustomerSettingsStore);
      // Defer so rewards rehydration completes first; then load orders and sync ledger (account-based).
      setTimeout(() => {
        useOrdersStore.getState().loadOrdersForUser(userId);
      }, 0);
    } catch (e) {
      console.warn('[App] Rehydrate error:', e);
    }

    // Close cart drawer on user switch (UI-only)
    try {
      useCartStore.setState({ isDrawerOpen: false } as any);
    } catch {}
  }, [userId]);

  React.useEffect(() => {
    // #region agent log
    fetch('/api/v1/__debug/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'debug-session',
        runId: 'run2',
        hypothesisId: 'C',
        location: 'src/App.tsx:useEffect',
        message: 'App mounted',
        data: {
          href: typeof window !== 'undefined' ? window.location.href : 'no-window',
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    // #region agent log
    const onError = (event: ErrorEvent) => {
      fetch('/api/v1/__debug/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'run4',
          hypothesisId: 'D',
          location: 'src/App.tsx:onError',
          message: 'window.error',
          data: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason: any = event.reason;
      fetch('/api/v1/__debug/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'debug-session',
          runId: 'run4',
          hypothesisId: 'D',
          location: 'src/App.tsx:onUnhandledRejection',
          message: 'window.unhandledrejection',
          data: {
            reasonMessage: reason?.message ?? String(reason),
            reasonName: reason?.name,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    // #endregion

    const stopHeartbeat = startHeartbeat('customer.web');
    const stopMetrics = startMetricProbes('customer.web');
    return () => {
      // #region agent log
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
      // #endregion
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
            <Route path="support/category/:slug" element={<SupportCategoryPage />} />
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
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="rewards" element={<RewardsHubLayout />}>
              <Route index element={<RewardsPage />} />
              <Route path="history" element={<RewardsHistoryPage />} />
              <Route path="redemptions" element={<RedemptionsPage />} />
              <Route path="challenges" element={<RewardsChallengesPage />} />
              <Route path="referrals" element={<ReferralsPage />} />
            </Route>
            <Route path="referrals" element={<Navigate to="/account/rewards/referrals" replace />} />
            <Route path="contributions" element={<ContributionsPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="profile" element={<ProfileSecurityPage />} />
            <Route path="returns" element={<ReturnsRefundsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="support" element={<SupportCenterPage />} />
            <Route path="support/tickets" element={<SupportTicketsPage />} />
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
