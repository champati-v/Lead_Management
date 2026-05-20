import { Bell, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types/auth";
import { useTheme } from "@/context/theme-context";

interface TopbarProps {
  search: string;
  onSearch: (value: string) => void;
  onAddLead: () => void;
  onMenu: () => void;
  role: UserRole;
}

export function Topbar({ search, onSearch, onAddLead, onMenu, role }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-background px-4 dark:border-slate-700 dark:bg-slate-900 md:px-6">
      <Button className="md:hidden" size="icon" variant="ghost" onClick={onMenu}><Menu className="h-4 w-4" /></Button>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Leads Overview</h1>
      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline" className="h-6 px-2 text-[11px] uppercase dark:border-slate-600 dark:text-slate-200">{role}</Badge>
        <Button className="h-9 w-9" size="icon" variant="outline" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input className="h-9 w-64 pl-9 text-sm dark:bg-slate-800 dark:text-slate-100" placeholder="Global search..." value={search} onChange={(e) => onSearch(e.target.value)} />
        </div>
        <button className="relative rounded-md p-2 text-slate-600 dark:text-slate-300"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" /></button>
        <Button className="h-9 rounded-md px-3" onClick={onAddLead}><Plus className="h-4 w-4" /></Button>
      </div>
    </header>
  );
}
