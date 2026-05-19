import { api } from "@/lib/api";
import type { Lead, LeadPayload, LeadsListResponse, LeadsQuery, LeadsStats } from "@/types/leads";

function toParams(query: LeadsQuery) {
  return {
    page: query.page,
    search: query.search || undefined,
    status: query.status || undefined,
    source: query.source || undefined,
    sort: query.sort || undefined,
  };
}

function toLeadArray(payload: any): Lead[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.leads)) return payload.leads;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function toMeta(payload: any, count: number) {
  const meta = payload?.meta ?? payload?.pagination ?? {};
  return {
    page: Number(meta.page ?? payload?.page ?? 1),
    totalPages: Number(meta.totalPages ?? meta.pages ?? payload?.totalPages ?? 1),
    total: Number(meta.total ?? payload?.total ?? count),
    limit: Number(meta.limit ?? payload?.limit ?? count),
  };
}

function toStats(payload: any): LeadsStats | undefined {
  const stats = payload?.stats ?? payload?.summary ?? payload?.counts;
  if (!stats) return undefined;
  const total = Number(stats.total ?? stats.all ?? 0);
  const qualified = Number(stats.qualified ?? 0);
  const newCount = Number(stats.new ?? 0);
  const contacted = Number(stats.contacted ?? 0);
  const lost = Number(stats.lost ?? 0);
  if ([total, qualified, newCount, contacted, lost].every((v) => Number.isFinite(v))) {
    return { total, qualified, new: newCount, contacted, lost };
  }
  return undefined;
}

function aggregateStats(leads: Lead[], total?: number): LeadsStats {
  return {
    total: total ?? leads.length,
    qualified: leads.filter((lead) => lead.status === "qualified").length,
    new: leads.filter((lead) => lead.status === "new").length,
    contacted: leads.filter((lead) => lead.status === "contacted").length,
    lost: leads.filter((lead) => lead.status === "lost").length,
  };
}

export async function getLeads(query: LeadsQuery): Promise<LeadsListResponse> {
  const { data } = await api.get("/api/leads", { params: toParams(query) });
  const body = data?.data ?? data;
  const leads = toLeadArray(body);
  return {
    data: leads,
    meta: toMeta(body, leads.length),
    stats: toStats(body),
  };
}

export async function getSystemLeadStats(): Promise<LeadsStats> {
  const firstPage = await getLeads({
    page: 1,
    search: "",
    status: "",
    source: "",
    sort: "latest",
  });

  if (firstPage.stats) {
    return firstPage.stats;
  }

  const allLeads: Lead[] = [...firstPage.data];
  const { totalPages, total } = firstPage.meta;

  for (let page = 2; page <= totalPages; page += 1) {
    const pageData = await getLeads({
      page,
      search: "",
      status: "",
      source: "",
      sort: "latest",
    });
    allLeads.push(...pageData.data);
  }

  return aggregateStats(allLeads, total);
}

export async function createLead(payload: LeadPayload) {
  const { data } = await api.post<Lead>("/api/leads", payload);
  return data;
}

export async function updateLead(id: string, payload: Partial<LeadPayload>) {
  const { data } = await api.patch<Lead>(`/api/leads/${id}`, payload);
  return data;
}

export async function deleteLead(id: string) {
  await api.delete(`/api/leads/${id}`);
}

export async function exportLeadsCsv(filters?: Partial<Pick<LeadsQuery, "page" | "search" | "status" | "source" | "sort">>) {
  const params = new URLSearchParams();
  params.set("page", String(filters?.page ?? 1));
  params.set("search", (filters?.search ?? "").toString());
  params.set("status", (filters?.status ?? "all").toString());
  params.set("source", (filters?.source ?? "all").toString());
  params.set("sort", (filters?.sort ?? "latest").toString());

  const { data } = await api.get<Blob>(`/api/leads/export/csv?${params.toString()}`, {
    responseType: "blob",
  });
  return data;
}

export function calcStats(leads: Lead[]): LeadsStats {
  const safeLeads = Array.isArray(leads) ? leads : [];
  return aggregateStats(safeLeads);
}
