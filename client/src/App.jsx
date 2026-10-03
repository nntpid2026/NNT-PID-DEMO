import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

import AdminShell from './components/AdminShell';
import CompanyShell from './components/CompanyShell';
import PageNotFound from './pages/PageNotFound';

import AuthLayout from './components/AuthLayout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OtpVerify from './pages/auth/OtpVerify';
import PendingApproval from './pages/auth/PendingApproval';
import Revoked from './pages/auth/Revoked';

import AdminDashboard from './pages/admin/AdminDashboard';
import Requests from './pages/admin/Requests';
import Companies from './pages/admin/Companies';
import AdminSettings from './pages/admin/AdminSettings';

import CompanyDashboard from './pages/company/CompanyDashboard';
import LineEntry from './pages/company/LineEntry';
import Reports from './pages/company/Reports';
import CategoriesConfig from './pages/company/CategoriesConfig';
import Projects from './pages/company/Projects';
import Users from './pages/company/Users';
import CompanySettings from './pages/company/CompanySettings';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="otp" element={<OtpVerify />} />
            <Route path="pending" element={<PendingApproval />} />
            <Route path="revoked" element={<Revoked />} />
          </Route>
          
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />
            <Route path="requests" element={<Requests />} />
            <Route path="companies" element={<Companies />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          <Route path="/app" element={<CompanyShell />}>
            <Route index element={<CompanyDashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="line-entry" element={<LineEntry />} />
            <Route path="reports" element={<Reports />} />
            <Route path="categories" element={<CategoriesConfig />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<CompanySettings />} />
            {/* Add more company routes here later */}
          </Route>
          
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              fontSize: '0.875rem',
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
