import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiList, FiSettings, FiLogOut, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { cn } from '../utils/utils';

export default function AdminShell() {
  const location = useLocation();
  const path = location.pathname;

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('pid:sidebar') === '1'
  );

  useEffect(() => {
    localStorage.setItem('pid:sidebar', collapsed ? '1' : '0');
  }, [collapsed]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiGrid /> },
    { name: 'Requests', path: '/admin/requests', icon: <FiList /> },
    { name: 'Companies', path: '/admin/companies', icon: <FiList /> },
    { name: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={cn(
          "flex-shrink-0 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-[width] duration-300 ease-in-out",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center justify-between border-b border-slate-800",
            collapsed ? "px-2" : "px-6"
          )}
        >
          <Logo admin compact={collapsed} />
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            aria-controls="admin-sidebar"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
          >
            {collapsed ? <FiChevronsRight size={16} /> : <FiChevronsLeft size={16} />}
          </button>
        </div>

        <nav
          className={cn(
            "flex-1 overflow-y-auto scrollbar-thin space-y-1",
            collapsed ? "px-2 py-4" : "px-4 py-6"
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              title={item.name}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                path === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              {item.icon}
              {!collapsed && item.name}
            </Link>
          ))}
        </nav>

        <div className={cn("border-t border-slate-800", collapsed ? "p-2" : "p-4")}>
          <Link
            to="/"
            title="Logout"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <FiLogOut />
            {!collapsed && "Logout"}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex-shrink-0 border-b border-border bg-card flex items-center justify-between px-6">
          <h1 className="text-sm font-medium text-muted-foreground">
            Back office · Platform administration
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
