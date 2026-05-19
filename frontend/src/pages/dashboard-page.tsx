import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useDebounce } from "@/hooks/use-debounce";
import { calcStats, createLead, deleteLead, exportLeadsCsv, getLeads, getSystemLeadStats, updateLead } from "@/services/leads-service";
import type { Lead, LeadsQuery, LeadsStats } from "@/types/leads";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { LeadsFilters } from "@/components/dashboard/leads-filters";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { Pagination } from "@/components/dashboard/pagination";
import { LeadDetailsSheet } from "@/components/dashboard/lead-details-sheet";
import { LeadFormDialog, type LeadFormValues } from "@/components/dashboard/lead-form-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [systemStats, setSystemStats] = useState<LeadsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState<LeadsQuery>({ page: 1, search: "", status: "", source: "", sort: "latest" });
  const [sheetMode, setSheetMode] = useState<"lead" | "profile" | null>(null);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);

  const debouncedSearch = useDebounce(query.search);

  const fetchSystemStats = async () => {
    try {
      const stats = await getSystemLeadStats();
      setSystemStats(stats);
    } catch {
      setSystemStats(null);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads({ ...query, search: debouncedSearch });
      setLeads(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStats();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [query.page, query.status, query.source, query.sort, debouncedSearch]);

  const stats = systemStats ?? calcStats(leads);

  const handleSaveLead = async (values: LeadFormValues) => {
    setSaving(true);
    try {
      if (editingLead) {
        await updateLead(editingLead._id, values);
        toast.success("Lead updated");
      } else {
        await createLead(values);
        toast.success("Lead created");
      }
      setFormOpen(false);
      setEditingLead(null);
      await Promise.all([fetchLeads(), fetchSystemStats()]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to save lead");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLead(deleteTarget._id);
      toast.success("Lead deleted");
      if (detailsLead?._id === deleteTarget._id) {
        setDetailsLead(null);
        setSheetMode(null);
      }
      setDeleteTarget(null);
      await Promise.all([fetchLeads(), fetchSystemStats()]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to delete lead");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportLeadsCsv({ page: query.page, search: query.search, status: query.status || "all", source: query.source || "all", sort: query.sort || "latest" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      toast.error("Failed to export csv");
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar
        user={user}
        open={mobileSidebar}
        onClose={() => setMobileSidebar(false)}
        onCreateLead={() => { setEditingLead(null); setFormOpen(true); }}
        onViewProfile={() => { setSheetMode("profile"); setDetailsLead(null); }}
        onLogout={() => { logout(); navigate("/auth"); }}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar role={user.role} search={query.search} onSearch={(value) => setQuery((q) => ({ ...q, page: 1, search: value }))} onAddLead={() => { setEditingLead(null); setFormOpen(true); }} onMenu={() => setMobileSidebar(true)} />

        <main className="flex-1 space-y-4 overflow-hidden p-4 md:p-5">
          <StatsCards stats={stats} />

          <section className="flex h-[calc(100%-7.5rem)] flex-col rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="p-3"><LeadsFilters query={query} setQuery={setQuery} showExport={user.role === "admin"} onExport={handleExport} /></div>

            {loading
              ? <div className="space-y-2 border-t border-slate-200 p-3 dark:border-slate-700"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
              : <LeadsTable leads={leads} canDelete={user.role === "admin"} onRowClick={(lead) => { setDetailsLead(lead); setSheetMode("lead"); }} onEdit={(lead) => { setEditingLead(lead); setFormOpen(true); }} onDelete={(lead) => setDeleteTarget(lead)} />}

            <Pagination page={query.page} totalPages={totalPages} onPageChange={(page) => setQuery((q) => ({ ...q, page }))} />
          </section>
        </main>
      </div>

      <LeadDetailsSheet
        lead={detailsLead}
        profile={user}
        mode={sheetMode}
        open={sheetMode !== null}
        canDelete={user.role === "admin"}
        onOpenChange={(open) => { if (!open) { setSheetMode(null); setDetailsLead(null); } }}
        onEditLead={(lead) => { setEditingLead(lead); setFormOpen(true); }}
        onDeleteLead={(lead) => setDeleteTarget(lead)}
        onLogout={() => { logout(); navigate("/auth"); }}
      />

      <LeadFormDialog open={formOpen} onOpenChange={setFormOpen} lead={editingLead} loading={saving} onSubmit={handleSaveLead} />

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm p-5">
          <DialogHeader><DialogTitle className="text-xl">Delete Lead</DialogTitle></DialogHeader>
          <p className="mt-2 text-sm text-slate-600">Are you sure you want to delete {deleteTarget?.name}? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" className="h-8" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" className="h-8" onClick={handleDeleteConfirmed}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}




