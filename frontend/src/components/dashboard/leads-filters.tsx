import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LeadsQuery } from "@/types/leads";

interface LeadsFiltersProps {
  query: LeadsQuery;
  setQuery: React.Dispatch<React.SetStateAction<LeadsQuery>>;
  showExport: boolean;
  onExport: () => void;
}

export function LeadsFilters({ query, setQuery, showExport, onExport }: LeadsFiltersProps) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <Input className="h-9 pl-9 text-sm dark:bg-slate-800 dark:text-slate-100" placeholder="Filter leads..." value={query.search} onChange={(e) => setQuery((q) => ({ ...q, page: 1, search: e.target.value }))} />
      </div>
      <select className="h-9 rounded-md border border-input bg-background px-3 text-sm dark:bg-slate-800 dark:text-slate-100" value={query.status} onChange={(e) => setQuery((q) => ({ ...q, page: 1, status: e.target.value }))}>
        <option value="">All Status</option><option value="new">New</option><option value="qualified">Qualified</option><option value="contacted">Contacted</option><option value="lost">Lost</option>
      </select>
      <select className="h-9 rounded-md border border-input bg-background px-3 text-sm dark:bg-slate-800 dark:text-slate-100" value={query.source} onChange={(e) => setQuery((q) => ({ ...q, page: 1, source: e.target.value }))}>
        <option value="">All Sources</option><option value="website">Website</option><option value="instagram">Instagram</option><option value="referral">Referral</option>
      </select>
      <Select value={query.sort} onValueChange={(value) => setQuery((q) => ({ ...q, page: 1, sort: value }))}>
        <SelectTrigger className="w-[140px] dark:bg-slate-800 dark:text-slate-100"><SelectValue placeholder="Sort by" /></SelectTrigger>
        <SelectContent className="dark:border-slate-700 dark:bg-slate-900">
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
      {showExport ? <Button className="h-9 px-3 text-sm" variant="outline" onClick={onExport}>Export CSV</Button> : null}
    </div>
  );
}
