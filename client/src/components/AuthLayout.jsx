import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border">
        <Logo />
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md surface p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
