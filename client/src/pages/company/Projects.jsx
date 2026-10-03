import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiFolder, FiCheckCircle, FiTrash2, FiClock, FiActivity } from 'react-icons/fi';
import { cn } from '../../utils/utils';
import { useMockStore } from '../../context/useMockStore';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const EMPTY_FORM = { code: '', title: '', capacity: '', rev: '00' };
const inputCls = 'w-full h-9 px-3 rounded-md border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40';

export default function Projects() {
  const {
    projects, activeProjectId, setActiveProject, addProject, deleteProject, lineCountForProject,
  } = useMockStore();

  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirm, setConfirm] = useState({ open: false, project: null });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleCreate = (e) => {
    e.preventDefault();
    const code = form.code.trim();
    if (!code) { toast.error('Project code is required'); return; }
    if (projects.some((p) => p.code.toLowerCase() === code.toLowerCase())) {
      toast.error('That project code already exists');
      return;
    }
    const id = addProject(form);
    setActiveProject(id);
    setIsCreating(false);
    setForm(EMPTY_FORM);
    toast.success(`Project ${code} created`);
  };

  const handleActivate = (project) => {
    if (project.id === activeProjectId) return;
    setActiveProject(project.id);
    toast.success(`Now working on ${project.code}`);
  };

  const handleDelete = () => {
    const target = confirm.project;
    if (!target) return;
    if (projects.length <= 1) {
      toast.error('Keep at least one project');
      setConfirm({ open: false, project: null });
      return;
    }
    const fallback = projects.find((p) => p.id !== target.id);
    const wasActive = target.id === activeProjectId;
    deleteProject(target.id);
    if (wasActive && fallback) setActiveProject(fallback.id);
    setConfirm({ open: false, project: null });
    toast.success(`Project ${target.code} deleted`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Manage your engineering projects. Switching the active project updates the lines,
            dashboard and reports across the app.
          </p>
        </div>
        <button
          type="button"
          onClick={() => (isCreating ? setIsCreating(false) : (setForm(EMPTY_FORM), setIsCreating(true)))}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm self-start sm:self-auto"
        >
          <FiPlus size={16} aria-hidden="true" />
          {isCreating ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {/* Create form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="surface p-6 rounded-xl border border-border bg-card space-y-4">
          <h3 className="font-semibold text-foreground">Create New Project</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="np-code" className="text-xs font-medium text-muted-foreground">Project Code *</label>
              <input id="np-code" value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. P-2025-X" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="np-title" className="text-xs font-medium text-muted-foreground">Project Title</label>
              <input id="np-title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Project name" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="np-capacity" className="text-xs font-medium text-muted-foreground">Capacity</label>
              <input id="np-capacity" value={form.capacity} onChange={(e) => set('capacity', e.target.value)} placeholder="e.g. 500 TPD" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="np-rev" className="text-xs font-medium text-muted-foreground">Initial Rev.</label>
              <input id="np-rev" value={form.rev} onChange={(e) => set('rev', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Create Project
            </button>
          </div>
        </form>
      )}

      {/* Project grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map((project) => {
          const isActive = project.id === activeProjectId;
          const lineCount = lineCountForProject(project.id);
          return (
            <div
              key={project.id}
              className={cn(
                'surface rounded-xl border flex flex-col hover:shadow-md transition-all duration-300 group',
                isActive ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'
              )}
            >
              <div className="p-5 flex items-start justify-between border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                  )}>
                    <FiFolder size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg leading-tight">{project.code}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Rev {project.rev}</p>
                  </div>
                </div>

                {isActive && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
                    <FiCheckCircle size={12} aria-hidden="true" /> Active
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">{project.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">Capacity: {project.capacity}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <FiActivity aria-hidden="true" /> Lines
                    </div>
                    <div className="text-xl font-bold nums text-foreground">{lineCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <FiClock aria-hidden="true" /> Updated
                    </div>
                    <div className="text-sm font-medium text-foreground mt-1">{project.updated}</div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-muted/10 flex items-center justify-between mt-auto">
                {!isActive ? (
                  <button
                    type="button"
                    onClick={() => handleActivate(project)}
                    className="text-sm font-medium text-primary hover:underline transition-colors"
                  >
                    Set as Active
                  </button>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">Currently Working</span>
                )}

                <button
                  type="button"
                  onClick={() => setConfirm({ open: true, project })}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                  title="Delete project"
                  aria-label={`Delete project ${project.code}`}
                >
                  <FiTrash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl bg-muted/5">
            <FiFolder className="text-muted-foreground mb-4" size={40} aria-hidden="true" />
            <h3 className="font-semibold text-foreground">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first project to start entering lines.</p>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="h-10 px-4 inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <FiPlus size={16} aria-hidden="true" /> New Project
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete this project?"
        message={`Project ${confirm.project?.code || ''} and its ${confirm.project ? lineCountForProject(confirm.project.id) : 0} line(s) will be removed. This cannot be undone.`}
        confirmLabel="Delete project"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, project: null })}
      />
    </div>
  );
}
