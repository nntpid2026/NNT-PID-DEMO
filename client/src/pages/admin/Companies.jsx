import React, { useState } from 'react';
import { FiSearch, FiSettings, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const mockCompanies = [
  { id: 1, name: 'Acme Engineering', tier: 'Enterprise', users: 12, projects: 4, status: 'active' },
  { id: 2, name: 'Global Build', tier: 'Pro', users: 5, projects: 2, status: 'active' },
  { id: 3, name: 'Omega Tech', tier: 'Basic', users: 2, projects: 1, status: 'revoked' },
  { id: 4, name: 'Delta Projects', tier: 'Pro', users: 8, projects: 3, status: 'active' },
  { id: 5, name: 'Nexus Pipeline', tier: 'Enterprise', users: 45, projects: 12, status: 'active' },
  { id: 6, name: 'Stark Industries', tier: 'Enterprise', users: 120, projects: 8, status: 'active' },
  { id: 7, name: 'Wayne Enterprises', tier: 'Pro', users: 15, projects: 5, status: 'revoked' },
];

export default function Companies() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = mockCompanies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const TierBadge = ({ tier }) => {
    switch (tier) {
      case 'Enterprise': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">Enterprise</span>;
      case 'Pro': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">Pro</span>;
      case 'Basic': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Basic</span>;
      default: return null;
    }
  };

  const handleRowClick = (company) => {
    // Phase 2.5 Mock redirect
    navigate('/admin/settings', { state: { targetCompany: company.name } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Companies Directory</h2>
          <p className="text-muted-foreground">Manage active workspaces and subscriptions.</p>
        </div>
      </div>

      <div className="surface flex flex-col">
        {/* Toolbar */}
        <div className="p-4 flex items-center justify-between gap-4 border-b border-border bg-muted/10">
          <div className="relative w-full sm:w-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..." 
              className="field-input pl-9 w-full sm:w-[320px]" 
            />
          </div>
          <button className="h-10 px-4 flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Export CSV
          </button>
        </div>

        {/* Table Grid */}
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="eng-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Tier</th>
                <th className="text-right">Users</th>
                <th className="text-right">Projects</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((company) => (
                  <tr 
                    key={company.id} 
                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(company)}
                  >
                    <td className="font-medium text-foreground py-4">
                      {company.name}
                    </td>
                    <td><TierBadge tier={company.tier} /></td>
                    <td className="text-right nums text-muted-foreground">{company.users}</td>
                    <td className="text-right nums text-muted-foreground">{company.projects}</td>
                    <td>
                      <span className={`inline-flex items-center w-2 h-2 rounded-full mr-2 ${company.status === 'active' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                      <span className="text-sm text-muted-foreground capitalize">{company.status}</span>
                    </td>
                    <td className="text-right">
                      <button 
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(company);
                        }}
                      >
                        <FiSettings size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-muted-foreground">
                    No companies match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Design */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
          <div className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-semibold text-foreground">1</span> to <span className="font-semibold text-foreground">{filtered.length}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> results
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50" disabled>
              <FiChevronLeft size={16}/>
            </button>
            <button className="w-8 h-8 rounded border border-border bg-card text-sm font-medium text-foreground shadow-sm">
              1
            </button>
            <button className="p-1.5 rounded border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50" disabled>
              <FiChevronRight size={16}/>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
