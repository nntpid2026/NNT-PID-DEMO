import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiGrid, FiList, FiSettings, FiUsers, FiFolder, FiFileText, FiLogOut, FiChevronsLeft, FiChevronsRight, FiMenu, FiX } from 'react-icons/fi';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { cn } from '../utils/utils';
import { useMockStore } from '../context/useMockStore';
import Select from './ui/Select';

export default function CompanyShell() {
  const location = useLocation();
  const path = location.pathname;
  const isWorkspace = path === '/app/line-entry';
  const { companyName, projects, activeProject, activeProjectId, setActiveProject } = useMockStore();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('pid:sidebar') === '1'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [path]);

  useEffect(() => {
    localStorage.setItem('pid:sidebar', collapsed ? '1' : '0');
  }, [collapsed]);

  const initials = companyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const activeProjectLabel = activeProject
    ? `${activeProject.code} · ${activeProject.title}`
    : 'No active project';

  const projectNav = [
    { name: 'Dashboard', path: '/app', icon: <FiGrid /> },
    { name: 'Line Entry', path: '/app/line-entry', icon: <FiList /> },
    { name: 'Reports', path: '/app/reports', icon: <FiFileText /> },
    { name: 'Categories & Fields', path: '/app/categories', icon: <FiSettings /> },
  ];

  const lowerNav = [
    { name: 'Projects', path: '/app/projects', icon: <FiFolder /> },
    { name: 'Users', path: '/app/users', icon: <FiUsers /> },
    { name: 'Settings', path: '/app/settings', icon: <FiSettings /> },
  ];

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      title={item.name}
      aria-current={path === item.path ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        path === item.path
          ? "bg-primary/15 text-primary font-semibold ring-1 ring-inset ring-primary/30 dark:bg-primary/25 dark:ring-primary/40"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {item.icon}
      {!collapsed && item.name}
    </Link>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="app-sidebar"
        className={cn(
          "flex-shrink-0 bg-card flex flex-col border-r border-border transition-all duration-300 ease-in-out z-50",
          "fixed inset-y-0 left-0 md:relative",
          isMobileMenuOpen ? "translate-x-0 w-64 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0",
          !isMobileMenuOpen && collapsed ? "md:w-[76px]" : "md:w-64"
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center justify-between border-b border-border",
            collapsed && !isMobileMenuOpen ? "px-2" : "px-6"
          )}
        >
          <Logo compact={collapsed && !isMobileMenuOpen} />
          
          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden md:flex p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <FiChevronsRight size={16} /> : <FiChevronsLeft size={16} />}
          </button>
          
          {/* Mobile Close Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 -mr-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav
          className={cn(
            "flex-1 overflow-y-auto scrollbar-thin",
            collapsed ? "px-2 py-4 space-y-4" : "px-4 py-6 space-y-8"
          )}
        >
          <div>
            <h2
              className={cn(
                "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
                collapsed ? "sr-only" : "px-3"
              )}
            >
              Active Project
            </h2>
            <div className="space-y-1">
              {projectNav.map(item => <NavLink key={item.name} item={item} />)}
            </div>
          </div>

          <div>
            <h2
              className={cn(
                "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2",
                collapsed ? "sr-only" : "px-3"
              )}
            >
              Workspace
            </h2>
            <div className="space-y-1">
              {lowerNav.map(item => <NavLink key={item.name} item={item} />)}
            </div>
          </div>
        </nav>

        <div className={cn("border-t border-border", collapsed ? "p-2 space-y-1" : "p-4 space-y-2")}>
          <Link
            to="/"
            title="Logout"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
              collapsed && "justify-center px-0"
            )}
          >
            <FiLogOut />
            {!collapsed && "Logout"}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header */}
        <header className="h-16 flex-shrink-0 border-b border-border bg-card flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <button 
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <div className="text-sm font-medium truncate hidden sm:block">{companyName}</div>
            <div className="h-4 w-px bg-border shrink-0 hidden sm:block"></div>
            <div className="w-full sm:w-64 max-w-[200px] sm:max-w-none">
              <Select
                id="header-active-project"
                value={activeProjectId}
                onChange={(v) => setActiveProject(v)}
                options={projects.map((p) => ({ value: p.id, label: `${p.code} — ${p.title}` }))}
                allowEmpty={false}
                ariaLabel="Active project"
                className="h-9 bg-secondary/50 font-medium border-0 w-full"
                panelClassName="min-w-[250px] sm:min-w-[280px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <ThemeToggle />
            <div
              className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs"
              title="Signed in user"
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main
          id="main-content"
          className={cn(
            'flex-1 min-w-0 scrollbar-thin',
            isWorkspace ? 'overflow-hidden' : 'overflow-y-auto p-6'
          )}
        >
          <div className={cn('h-full', !isWorkspace && 'max-w-7xl mx-auto')}>
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
