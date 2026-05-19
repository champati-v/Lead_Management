import { Globe, Camera, MoreVertical, UserRoundPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lead } from "@/types/leads";

const statusVariant: Record<string, "info" | "success" | "warning" | "danger"> = {
  new: "info",
  qualified: "success",
  contacted: "warning",
  lost: "danger",
};

function sourceIcon(source: string) {
  const key = source.toLowerCase();
  if (key.includes("insta")) return <Camera className="h-3.5 w-3.5 text-pink-500" />;
  if (key.includes("refer")) return <UserRoundPlus className="h-3.5 w-3.5 text-blue-600" />;
  return <Globe className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />;
}

interface LeadsTableProps {
  leads: Lead[];
  canDelete: boolean;
  onRowClick: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export function LeadsTable({ leads, canDelete, onRowClick, onEdit, onDelete }: LeadsTableProps) {
  return (
    <div className="max-h-[420px] overflow-auto border-t border-slate-200 dark:border-slate-700">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white dark:bg-slate-900">
          <TableRow className="h-10">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-14">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead._id} className="h-12 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60" onClick={() => onRowClick(lead)}>
              <TableCell className="text-sm font-medium text-slate-900 dark:text-slate-100">{lead.name}</TableCell>
              <TableCell className="text-sm text-slate-700 dark:text-slate-300">{lead.email}</TableCell>
              <TableCell><Badge className="text-[11px] uppercase" variant={statusVariant[lead.status]}>{lead.status}</Badge></TableCell>
              <TableCell className="text-sm text-slate-700 dark:text-slate-300"><div className="flex items-center gap-1.5">{sourceIcon(lead.source)}{lead.source}</div></TableCell>
              <TableCell className="text-sm text-slate-700 dark:text-slate-300">{new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:border-slate-700 dark:bg-slate-900">
                    <DropdownMenuItem onClick={() => onRowClick(lead)}>View</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(lead)}>Edit</DropdownMenuItem>
                    {canDelete ? <DropdownMenuItem onClick={() => onDelete(lead)}>Delete</DropdownMenuItem> : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
