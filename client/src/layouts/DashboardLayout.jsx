/**
 * DashboardLayout.jsx — Authenticated app shell
 *
 * Structure:
 *  ┌──────────────────────────────────┐
 *  │  Sidebar  │  Topbar             │
 *  │           ├─────────────────────│
 *  │           │  <Outlet />         │
 *  │           │  (page content)     │
 *  └──────────────────────────────────┘
 *
 * - Sidebar is always visible on ≥md screens
 * - On mobile, sidebar slides in via a toggle button in Topbar
 * - ProtectedRoute is nested inside this layout via AppRoutes
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar  from '../components/layout/Topbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--bg-base)]">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main column ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen((o) => !o)} />

        {/* Page content */}
        <main
          id="dashboard-main"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
