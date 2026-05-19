import { CheckCircle2, MessageSquareText, UserRoundX, Users, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LeadsStats } from "@/types/leads";

export function StatsCards({ stats }: { stats: LeadsStats }) {
  const items = [
    { label: "Total Leads", value: stats.total, icon: Users, iconBg: "bg-slate-100 dark:bg-slate-800" },
    { label: "Qualified", value: stats.qualified, icon: CheckCircle2, iconBg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { label: "New", value: stats.new, icon: BadgeCheck, iconBg: "bg-blue-50 dark:bg-blue-900/30" },
    { label: "Contacted", value: stats.contacted, icon: MessageSquareText, iconBg: "bg-amber-50 dark:bg-amber-900/30" },
    { label: "Lost", value: stats.lost, icon: UserRoundX, iconBg: "bg-rose-50 dark:bg-rose-900/30" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card className="flex items-center gap-3 rounded-lg border-slate-200 p-3 dark:border-slate-700 dark:bg-slate-900" key={item.label}>
          <div className={`grid h-10 w-10 place-items-center rounded-md ${item.iconBg}`}><item.icon className="h-5 w-5 text-slate-700 dark:text-slate-200" /></div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{item.value.toLocaleString()}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
