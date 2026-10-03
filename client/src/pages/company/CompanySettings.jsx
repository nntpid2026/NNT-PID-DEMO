import React, { useState } from 'react';
import { FiSave, FiAlertTriangle, FiX } from 'react-icons/fi';
import Select from '../../components/ui/Select';
import { useMockStore } from '../../context/useMockStore';

export default function CompanySettings() {
  const { companyName = 'Acme Engineering' } = useMockStore?.() || {};
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="max-w-4xl space-y-8 pb-12 animate-in fade-in duration-300">
      
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Workspace Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your company profile and default app preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Company Profile</h3>
          <p className="text-sm text-muted-foreground mt-1">This information is displayed on your BOQ reports.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name</label>
            <input className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm" defaultValue={companyName} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Registered Email</label>
            <input className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm" defaultValue="admin@acme.com" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Contact Person</label>
            <input className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm" defaultValue="John Doe" />
          </div>
        </div>
        
        <div className="flex justify-end pt-6 border-t border-border">
          <button className="h-10 px-6 flex items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">
            <FiSave size={16} /> Save Changes
          </button>
        </div>
      </div>


      <div className="bg-destructive/5 border border-destructive/20 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-destructive flex items-center gap-2">
            <FiAlertTriangle /> Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Irreversible actions for your workspace.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-destructive/20 rounded-xl bg-card shadow-sm gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-foreground">Delete Workspace</label>
            <p className="text-xs text-muted-foreground">Permanently delete your company account and all project data. This action requires super admin approval.</p>
          </div>
          <button 
            onClick={() => setIsDeleting(true)}
            className="h-10 px-6 rounded-lg border border-destructive/50 text-destructive text-sm font-semibold hover:bg-destructive hover:text-white transition-colors shrink-0 shadow-sm"
          >
            Request Deletion
          </button>
        </div>
      </div>

      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-destructive flex items-center gap-2">
                <FiAlertTriangle /> Confirm Deletion
              </h3>
              <button type="button" onClick={() => setIsDeleting(false)} className="p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-foreground font-medium mb-4">
                Are you sure you want to delete <span className="font-bold text-destructive">{companyName}</span>?
              </p>
              <p className="text-sm text-muted-foreground">
                This action is permanent and cannot be undone. All projects, user data, and reports associated with this workspace will be removed.
              </p>
            </div>
            
            <div className="p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsDeleting(false)} 
                className="h-10 px-5 rounded-lg bg-transparent hover:bg-muted text-foreground text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => setIsDeleting(false)}
                className="h-10 px-6 rounded-lg bg-destructive text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                Delete Workspace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
