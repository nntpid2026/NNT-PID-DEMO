import React, { useState } from 'react';
import { FiUserPlus, FiTrash2, FiMail, FiCheckCircle, FiX } from 'react-icons/fi';
import Select from '../../components/ui/Select';

const mockUsers = [
  { id: 1, name: 'Faizan Mansuri', email: 'faizan@bom-boq.com', role: 'Company Admin', status: 'Active', added: 'Oct 1, 2026', isYou: true },
  { id: 2, name: 'John Doe', email: 'john@bom-boq.com', role: 'Engineer', status: 'Active', added: 'Oct 1, 2026', isYou: false },
  { id: 3, name: 'Sarah Smith', email: 'sarah.s@bom-boq.com', role: 'Engineer', status: 'Invited', added: 'Just now', isYou: false },
];

export default function Users() {
  const [users, setUsers] = useState(mockUsers);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Engineer');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;
    
    const newUser = {
      id: Date.now(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole || 'Engineer',
      status: 'Invited',
      added: 'Just now',
      isYou: false
    };
    
    setUsers([...users, newUser]);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('Engineer');
    setIsInviting(false);
  };

  const removeUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const RoleBadge = ({ role }) => {
    if (role === 'Company Admin' || role === 'Admin') {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">{role}</span>;
    }
    if (role === 'Engineer') {
      return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50">{role}</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">{role}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Team Management</h2>
          <p className="text-sm text-muted-foreground">Invite engineers and manage access to your workspace.</p>
        </div>
        
        <button 
          onClick={() => setIsInviting(!isInviting)}
          className="h-10 px-4 flex items-center gap-2 rounded-md bg-[#17707B] text-white text-sm font-medium hover:bg-[#125861] transition-colors shadow-sm"
        >
          <FiUserPlus size={16} /> Invite Member
        </button>
      </div>

      {isInviting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-border flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Invite New User</h3>
              <button type="button" onClick={() => setIsInviting(false)} className="p-2 -mr-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="flex flex-col overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">User Details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="Jane Doe" 
                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="jane@company.com" 
                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</label>
                    <input
                      type="text"
                      list="roles-list"
                      required
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      placeholder="Select or type..."
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
                    />
                    <datalist id="roles-list">
                      <option value="Engineer" />
                      <option value="Company Admin" />
                      <option value="Viewer" />
                      <option value="Editor" />
                    </datalist>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Permissions Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">App Permissions</h4>
                  <div className="space-y-3">
                    
                    {/* Selectable Permissions */}
                    {[
                      { key: 'lineEntry', label: 'Line Entry' },
                      { key: 'categories', label: 'Categories & Fields' },
                      { key: 'reports', label: 'Reports' },
                      { key: 'projects', label: 'Projects' }
                    ].map(perm => (
                      <div key={perm.key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background shadow-sm hover:border-primary/30 transition-colors">
                        <span className="text-sm font-medium">{perm.label}</span>
                        <select className="h-8 px-2 pr-8 rounded-lg bg-secondary text-sm border-none focus:ring-2 focus:ring-primary/40 cursor-pointer font-medium">
                          <option value="write">Read & Write</option>
                          <option value="read">Read Only</option>
                          <option value="none">No Access</option>
                        </select>
                      </div>
                    ))}
                    
                  </div>
                </div>

              </div>
              
              <div className="p-5 sm:p-6 border-t border-border bg-muted/20 flex justify-end gap-3">
                <button type="button" onClick={() => setIsInviting(false)} className="h-10 px-5 rounded-lg bg-transparent hover:bg-muted text-foreground text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-4 px-6 font-semibold">Member</th>
                <th className="py-4 px-4 font-semibold">Role</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Added</th>
                <th className="py-4 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20 shadow-sm">
                        {user.name !== '—' ? user.name.substring(0,2).toUpperCase() : <FiMail />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                          {user.name} 
                          {user.isYou && <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">You</span>}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4"><RoleBadge role={user.role} /></td>
                  <td className="py-4 px-4">
                    {user.status === 'Active' ? (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                         <FiCheckCircle size={12} /> Active
                       </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50">
                         <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground font-medium">{user.added}</td>
                  <td className="py-4 px-6 text-right">
                    {!user.isYou && (
                      <button 
                        onClick={() => removeUser(user.id)}
                        className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded transition-colors opacity-0 group-hover:opacity-100" 
                        title="Remove User"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
