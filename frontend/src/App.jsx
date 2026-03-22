import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import CourseLearning from './pages/CourseLearning';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import BundleDetail from './pages/BundleDetail';
import RequireAdmin from './lib/RequireAdmin';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminBundlesPage from './pages/admin/AdminBundlesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

/** Protected route wrapper: requires valid JWT (see `api.auth.me()` in AuthContext). */
const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#020817]">
        <div className="w-8 h-8 border-4 border-slate-600 border-t-violet-500 rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }
  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search || ''}`);
    const adminArea =
      location.pathname.startsWith("/admin") && location.pathname !== "/admin/login";
    const loginPath = adminArea ? "/admin/login" : "/login";
    return <Navigate to={`${loginPath}?next=${next}`} replace />;
  }
  return children;
};

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/CourseLearning" element={<RequireAuth><CourseLearning /></RequireAuth>} />
      <Route path="/Dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="bundles" element={<AdminBundlesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
      <Route
        path="/Checkout"
        element={
          <RequireAuth>
            <LayoutWrapper currentPageName="Checkout">
              <Checkout />
            </LayoutWrapper>
          </RequireAuth>
        }
      />
      <Route
        path="/BundleDetail"
        element={
          <LayoutWrapper currentPageName="BundleDetail">
            <BundleDetail />
          </LayoutWrapper>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <CartProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <NavigationTracker />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App