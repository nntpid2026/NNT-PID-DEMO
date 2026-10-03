import React, { useState } from 'react';
import { FiSave, FiLock, FiAlertTriangle } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

export default function AdminSettings() {
  const location = useLocation();
  const targetCompany = location.state?.targetCompany; // passed from Phase 2.4 mock

  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground">Manage your admin profile and global system preferences.</p>
      </div>

      {targetCompany && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary flex items-start gap-3">
          <FiAlertTriangle className="mt-0.5 shrink-0" size={16} />
          <p>
            <strong>Note:</strong> You navigated from the <strong>{targetCompany}</strong> row. 
            In a full implementation, this could open a specific company management drawer. 
            Showing global settings instead as per Phase 2.5 mock.
          </p>
        </div>
      )}

      {/* Admin Profile */}
      <div className="surface p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium">Admin Profile</h3>
          <p className="text-sm text-muted-foreground">Update your login credentials.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Email</label>
            <input className="field-input" defaultValue="admin@boq.com" />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-4 flex items-center gap-2 text-foreground">
            <FiLock className="text-muted-foreground" /> Change Password
          </h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <input type="password" className="field-input" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input type="password" className="field-input" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button className="h-10 px-4 flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <FiSave size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* System Settings */}
      <div className="surface p-6 space-y-6 border-red-500/20">
        <div>
          <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
            <FiAlertTriangle /> System Controls
          </h3>
          <p className="text-sm text-muted-foreground">Global platform toggles affecting all users.</p>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-md bg-muted/30">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-foreground">Maintenance Mode</label>
            <p className="text-xs text-muted-foreground">Prevents companies from logging in and shows a maintenance screen.</p>
          </div>
          
          <button 
            type="button"
            onClick={() => setMaintenance(!maintenance)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 ${maintenance ? 'bg-destructive' : 'bg-muted-foreground'}`}
            role="switch"
            aria-checked={maintenance}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${maintenance ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
