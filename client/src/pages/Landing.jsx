import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiZap, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

const CURRENT_YEAR = new Date().getFullYear();

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Go to Admin
          </Link>
          <Link to="/auth/login" className="text-sm font-medium hover:text-primary">
            Log in
          </Link>
          <Link to="/auth/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Register
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            BOM → BOQ · Engineering Document Automation
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Automate your <span className="text-primary">Material Take-Offs</span> instantly.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop counting lines manually. Config-driven B2B platform for engineering companies to manage projects, enter specs, and generate flawless BOQs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/app" className="h-12 px-8 flex items-center gap-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-lg">
              Start Company Workspace <FiArrowRight />
            </Link>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-20 bg-secondary/30 border-t border-b border-border">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div className="surface p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <FiSettings size={22} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold">Config-driven</h3>
              <p className="text-muted-foreground">Define your own categories, dropdowns, and text fields. The engine adapts to your exact standards.</p>
            </div>
            <div className="surface p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <FiZap size={22} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold">Power-user UX</h3>
              <p className="text-muted-foreground">Built for engineers. Tabular data entry, keyboard shortcuts, and instant autosave without friction.</p>
            </div>
            <div className="surface p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <FiBarChart2 size={22} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold">8 Report Types</h3>
              <p className="text-muted-foreground">Instantly generate Pipe MTOs, Valve Summaries, and BOQs. Export to CSV or pixel-perfect PDF.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border bg-card">
        &copy; {CURRENT_YEAR} BOM to BOQ Generator. Engineering SaaS.
      </footer>
    </div>
  );
}
