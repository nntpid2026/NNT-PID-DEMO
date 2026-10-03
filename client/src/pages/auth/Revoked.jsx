import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

export default function Revoked() {
  return (
    <div className="space-y-6 text-center py-4">
      <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto text-3xl">
        <FiAlertTriangle />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Access Revoked</h1>
        <p className="text-sm text-muted-foreground">
          Your company's access to the platform has been revoked by the administration.
          Please contact support if you believe this is a mistake.
        </p>
      </div>
      
      <div className="pt-4 space-y-3">
        <button onClick={() => alert("Support notified!")} className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Contact Support
        </button>
        <Link to="/auth/login" className="w-full inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
