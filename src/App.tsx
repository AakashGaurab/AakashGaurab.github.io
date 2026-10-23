/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PortfolioPage } from './pages/PortfolioPage';

// Admin and login are code-split so visitors of the public site don't download them.
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

function AppContent() {
  const { path } = useRouter();

  const renderCurrentRoute = () => {
    // Normalise path (strip query params / hashes if any)
    const cleanPath = path.split('?')[0].split('#')[0];

    switch (cleanPath) {
      case '/login':
        return <LoginPage />;
      case '/admin':
        return (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        );
      case '/':
      case '':
      default:
        return <PortfolioPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[#f4f4f5] antialiased">
      {/* Sticky Navbar: Always visible at top while scrolling */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 transition-opacity duration-200">
        <Suspense fallback={null}>{renderCurrentRoute()}</Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <PortfolioProvider>
          <AppContent />
        </PortfolioProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
