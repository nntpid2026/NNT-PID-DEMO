import React from 'react';
import { FiActivity, FiFileText, FiPlus, FiArrowRight, FiCheckCircle, FiAlertCircle, FiSettings, FiMaximize2, FiTool } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useMockStore } from '../../context/useMockStore';
import { cn } from '../../utils/utils';
import InsulationCalcCard from './lineEntry/InsulationCalcCard';

export default function CompanyDashboard() {
  const { lines, activeProject, companyName } = useMockStore();

  // ── Calculate Live Metrics ──
  const totalLines = lines.length;
  
  const totalPipeLength = lines.reduce((acc, l) => acc + (parseFloat(l.length) || 0), 0);
  
  const totalComponents = lines.reduce((acc, l) => {
    let count = 0;
    if (l.components) {
      Object.values(l.components).forEach(arr => {
        if (Array.isArray(arr)) {
          arr.forEach(item => {
            count += parseInt(item.qty || item.nos || 1, 10) || 1;
          });
        }
      });
    }
    return acc + count;
  }, 0);

  // Simple validation: lines missing length or size
  const missingDataCount = lines.filter(l => !l.size || !l.length || parseFloat(l.length) === 0).length;

  // Get recent 3 lines
  const recentLines = [...lines].reverse().slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 sm:p-10 shadow-lg">
        {/* Abstract shapes for premium feel */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-2xl mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {companyName}!</h1>
            <p className="text-primary-foreground/80 max-w-xl text-lg">
              Your active project <strong className="text-white">{activeProject?.code || '—'}</strong>
              {activeProject?.title ? ` — ${activeProject.title}` : ''} has {totalLines} line{totalLines === 1 ? '' : 's'} mapped so far.
            </p>
          </div>
          <Link to="/app/line-entry" className="shrink-0 group flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-medium shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
            Continue Data Entry
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiFileText size={48} />
          </div>
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Lines</div>
          <div className="text-4xl font-bold nums text-foreground">{totalLines}</div>
          <div className="text-xs text-muted-foreground font-medium mt-2 flex items-center gap-1">
            <FiActivity aria-hidden="true" /> Synced from Line Entry
          </div>
        </div>
        
        <div className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiMaximize2 size={48} />
          </div>
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Pipe Length</div>
          <div className="text-4xl font-bold nums text-foreground">{totalPipeLength}<span className="text-base text-muted-foreground ml-1">m</span></div>
          <div className="text-xs text-muted-foreground mt-2">Across all sizes & MOCs</div>
        </div>
        
        <div className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FiTool size={48} />
          </div>
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Components</div>
          <div className="text-4xl font-bold nums text-foreground">{totalComponents}</div>
          <div className="text-xs text-muted-foreground mt-2">Valves, fittings, instruments</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & BOQ */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
          
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link to="/app/line-entry" className="flex items-start gap-4 p-5 rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FiPlus size={20} />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors">Add New Line</h4>
                  <p className="text-sm text-muted-foreground mt-1">Enter new piping or valve specifications into the active project.</p>
                </div>
              </Link>
              
              <Link to="/app/reports" className="flex items-start gap-4 p-5 rounded-xl border border-border bg-gradient-to-br from-card to-muted/30 hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FiFileText size={20} />
                </div>
                <div>
                  <h4 className="font-medium group-hover:text-emerald-600 transition-colors">Generate Report</h4>
                  <p className="text-sm text-muted-foreground mt-1">Export current MTOs to Excel or view live BOQ summary.</p>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Insulation BOQ Preview */}
          <div className="flex-1 w-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Insulation Preview</h3>
            <InsulationCalcCard line={recentLines[0] || null} />
          </div>
          
        </div>

        {/* Right Column: Project Overview & Timeline */}
        <div className="space-y-8">
          
          {/* Active Project Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Active Project</h3>
              <Link to="/app/categories" className="text-muted-foreground hover:text-primary transition-colors" title="Configure Categories">
                <FiSettings />
              </Link>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Project</div>
                <div className="font-mono font-medium text-foreground">{activeProject?.code || '—'}</div>
                {activeProject?.title && (
                  <div className="text-sm text-muted-foreground mt-0.5">{activeProject.title}</div>
                )}
              </div>
              
              {/* Data Quality Warning */}
              {missingDataCount > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                  <FiAlertCircle className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Incomplete Lines</h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400/80 mt-0.5">
                      {missingDataCount} {missingDataCount === 1 ? 'line is' : 'lines are'} missing pipe length or size. Please update them in Line Entry.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Team</span>
                  <div className="flex items-center mt-2 -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">SA</div>
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold">MK</div>
                  </div>
                </div>
                <Link to="/app/projects" className="text-sm font-medium text-primary hover:underline">View Details</Link>
              </div>
            </div>
          </div>

          {/* Activity Timeline (Real Data) */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Recently Added Lines</h3>
            
            {recentLines.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center italic py-4">No lines added yet.</p>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                
                {recentLines.map((line, idx) => (
                  <div key={line.id} className={cn(
                    "relative flex items-center justify-start group",
                    idx === 0 ? "is-active" : ""
                  )}>
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-4 border-card shrink-0 shadow-sm relative z-10",
                      idx === 0 ? "bg-primary text-white" : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {idx === 0 ? <FiPlus size={12} /> : <FiFileText size={12} />}
                    </div>
                    <div className="pl-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">Line {line.no || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground mt-0.5 truncate">
                          {line.size} {line.moc} · {line.length || 0}m
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
