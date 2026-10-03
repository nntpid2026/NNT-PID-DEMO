import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiRefreshCw, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '../../utils/utils';

// Mock initial data
const initialRequests = [
  { id: 1, company: 'Acme Engineering', contact: 'John Doe', email: 'john@acme.com', date: '2026-09-30', status: 'pending' },
  { id: 2, company: 'Nexus Pipeline', contact: 'Sarah Connor', email: 's.connor@nexus.com', date: '2026-10-01', status: 'pending' },
  { id: 3, company: 'Global Build', contact: 'Mike Smith', email: 'mike@globalbuild.com', date: '2026-09-28', status: 'active' },
  { id: 4, company: 'Omega Tech', contact: 'Alice Wonderland', email: 'alice@omega.com', date: '2026-09-25', status: 'revoked' },
  { id: 5, company: 'Delta Projects', contact: 'Bob Builder', email: 'bob@delta.com', date: '2026-09-20', status: 'active' },
];

export default function Requests() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'active', label: 'Active' },
    { id: 'revoked', label: 'Revoked' },
    { id: 'all', label: 'All' }
  ];

  // Filter by tab and search query
  const filteredRequests = requests.filter(req => {
    const matchesTab = activeTab === 'all' ? true : req.status === activeTab;
    const matchesSearch = 
      req.company.toLowerCase().includes(search.toLowerCase()) || 
      req.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">Pending</span>;
      case 'active': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">Active</span>;
      case 'revoked': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">Revoked</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Requests & Companies</h2>
          <p className="text-muted-foreground">Manage company registrations and access.</p>
        </div>
      </div>

      <div className="surface flex flex-col">
        {/* Toolbar: Toggle and Search */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Segmented Toggle */}
          <div className="inline-flex items-center p-1 bg-muted rounded-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-sm transition-all duration-200",
                  activeTab === tab.id 
                    ? "bg-card shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies..." 
              className="field-input pl-9 sm:w-[280px]" 
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto scrollbar-thin border-t border-border">
          <table className="eng-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Registered</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="group">
                    <td className="font-medium text-foreground">{req.company}</td>
                    <td className="text-muted-foreground">{req.contact}</td>
                    <td className="text-muted-foreground">{req.email}</td>
                    <td className="nums text-muted-foreground">{req.date}</td>
                    <td><StatusBadge status={req.status} /></td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2 opacity-100 sm:opacity-80 group-hover:opacity-100 transition-opacity">
                        {req.status === 'pending' && (
                          <>
                            <button onClick={() => handleAction(req.id, 'active')} className="p-1.5 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded transition-colors" title="Approve">
                              <FiCheckCircle size={18} />
                            </button>
                            <button onClick={() => handleAction(req.id, 'revoked')} className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors" title="Reject">
                              <FiXCircle size={18} />
                            </button>
                          </>
                        )}
                        {req.status === 'active' && (
                          <button onClick={() => handleAction(req.id, 'revoked')} className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors" title="Revoke Access">
                            <FiXCircle size={18} />
                          </button>
                        )}
                        {req.status === 'revoked' && (
                          <button onClick={() => handleAction(req.id, 'active')} className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded transition-colors" title="Reinstate">
                            <FiRefreshCw size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FiSearch size={24} className="opacity-20" />
                      <p>No companies found for this filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Design */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
          <div className="text-xs text-muted-foreground font-medium">
            Showing <span className="font-semibold text-foreground">1</span> to <span className="font-semibold text-foreground">{filteredRequests.length}</span> of <span className="font-semibold text-foreground">{filteredRequests.length}</span> results
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
