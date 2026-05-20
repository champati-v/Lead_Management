import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Lead } from "@/types/leads";
import type { User } from "@/types/auth";

interface LeadDetailsSheetProps {
  lead: Lead | null;
  profile: User | null;
  mode: "lead" | "profile" | null;
  open: boolean;
  canDelete: boolean;
  onOpenChange: (open: boolean) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onLogout: () => void;
}

export function LeadDetailsSheet({ lead, profile, mode, open, canDelete, onOpenChange, onEditLead, onDeleteLead, onLogout }: LeadDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md border-l border-slate-200 bg-background p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5" overlayClassName="backdrop-blur-md">
        {mode === "lead" && lead ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Lead Details</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview and actions</p>
            </div>
            <div className="space-y-3 text-sm">
              <Field label="Name" value={lead.name} />
              <Field label="Email" value={lead.email} />
              <div><p className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</p><div className="mt-1"><Badge className="uppercase" variant={lead.status === "qualified" ? "success" : lead.status === "new" ? "info" : lead.status === "contacted" ? "warning" : "danger"}>{lead.status}</Badge></div></div>
              <Field label="Source" value={lead.source} />
              <Field label="Created" value={new Date(lead.createdAt).toLocaleDateString()} />
            </div>
            <div className="flex gap-2">
              <Button className="h-9" onClick={() => onEditLead(lead)}>Edit Lead</Button>
              {canDelete ? <Button className="h-9" variant="destructive" onClick={() => onDeleteLead(lead)}>Delete Lead</Button> : null}
            </div>
          </div>
        ) : null}

        {mode === "profile" && profile ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Profile</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Account details</p>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback>{(profile.email ?? profile.name ?? "U")[0]?.toUpperCase()}</AvatarFallback></Avatar>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{profile.name ?? "User"}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{profile.email ?? "-"}</p>
                <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{profile.role}</p>
              </div>
            </div>
            <Button className="h-9" variant="outline" onClick={onLogout}>Logout</Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-sm text-slate-900 dark:text-slate-100">{value}</p></div>;
}

