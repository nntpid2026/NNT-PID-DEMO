import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';

export default function PendingApproval() {
  return (
    <div className="space-y-6 text-center py-4">
      <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto text-3xl">
        <FiClock />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Awaiting Approval</h1>
        <p className="text-sm text-muted-foreground">
          Your company registration is pending review by our administration team. 
          You will receive an email once your workspace is activated.
        </p>
      </div>
      
      <div className="pt-4 space-y-3">
        <Link to="/auth/login" className="w-full inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
          Back to Login
        </Link>
        <button onClick={() => alert("Support notified!")} className="w-full inline-flex h-10 items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors text-foreground">
          Contact Support
        </button>
      </div>
    </div>
  );
}
