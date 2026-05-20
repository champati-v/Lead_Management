import { LayoutList, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types/auth";

interface SidebarProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onCreateLead: () => void;
  onLogout: () => void;
  onViewProfile: () => void;
}

export function Sidebar({ user, open, onClose, onCreateLead, onLogout, onViewProfile }: SidebarProps) {
  const profileText = user.email ?? user.name ?? "User";
  const avatarInitial = profileText[0]?.toUpperCase() ?? "U";

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200 bg-background px-4 py-4 transition-transform dark:border-slate-700 dark:bg-slate-900 md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-[#0d57d5] text-white"><LayoutList className="h-4 w-4" /></div>
        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Smart Leads</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">CRM Platform</p>
        </div>
      </div>

      <Button className="h-9 w-full justify-center rounded-md text-sm" onClick={onCreateLead}><Plus className="mr-1.5 h-4 w-4" />Create Lead</Button>
      <button className="mt-3 flex h-9 w-full items-center gap-2 rounded-md bg-blue-50 px-3 text-sm font-medium text-blue-700 dark:bg-slate-800 dark:text-blue-300"><Users className="h-4 w-4" />Leads</button>

      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md border border-slate-200 px-2.5 py-2 text-left dark:border-slate-700">
              <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{avatarInitial}</AvatarFallback></Avatar>
              <div className="min-w-0"><p className="truncate text-sm text-slate-800 dark:text-slate-200">{profileText}</p><p className="text-xs capitalize text-slate-500 dark:text-slate-400">{user.role}</p></div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="dark:border-slate-700 dark:bg-slate-900">
            <DropdownMenuItem onClick={onViewProfile}>View Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {open ? <button className="fixed inset-0 -z-10 bg-black/30 md:hidden" onClick={onClose} /> : null}
    </aside>
  );
}
