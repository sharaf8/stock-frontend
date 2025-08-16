import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import Warehouse from "./pages/Warehouse";
import Clients from "./pages/Clients";
import Sales from "./pages/Sales";
import Finance from "./pages/Finance";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/NotFound";
import { useThemeStore } from "./stores/themeStore";
import { useAuthStore } from "./stores/authStore";
import { useRBACStore } from "./stores/rbacStore";
import { useEffect } from "react";
import { suppressDefaultPropsWarnings } from "./lib/suppressWarnings";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => {
  const { theme, setTheme } = useThemeStore();
  const { isAuthenticated, user } = useAuthStore();
  const { initializeFromAuth } = useRBACStore();

  useEffect(() => {
    // Initialize theme on app load
    setTheme(theme);

    // Initialize RBAC when user is available
    if (user) {
      initializeFromAuth(user);
    }

    // Suppress React defaultProps warnings from recharts library
    // This is a temporary fix until the library fully migrates to JavaScript default parameters
    suppressDefaultPropsWarnings();
  }, [user, initializeFromAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route
              path="/auth/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/auth/forgot-password"
              element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />}
            />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/warehouse" element={<Warehouse />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/employees" element={<Employees />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Admin-only routes */}
                      <Route
                        path="/admin/users"
                        element={
                          <RoleProtectedRoute
                            requiredRoles={['super_admin', 'admin']}
                            requiredPermission={{ resource: 'users', action: 'read' }}
                          >
                            <UserManagement />
                          </RoleProtectedRoute>
                        }
                      />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
