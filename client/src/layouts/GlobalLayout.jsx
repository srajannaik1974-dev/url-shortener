/**
 * GlobalLayout.jsx — Root layout for public pages
 *
 * Renders: Navbar → <Outlet /> (page content)
 * Used by: Landing, Login, Register
 */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function GlobalLayout() {
  return (
    <div className="flex flex-col min-h-dvh bg-[var(--bg-base)]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
