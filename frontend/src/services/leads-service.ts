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

export async function getLeads(query: LeadsQuery): Promise<LeadsListResponse> {
  const { data } = await api.get("/api/leads", { params: toParams(query) });
  const body = data?.data ?? data;
  const leads = toLeadArray(body);
  return {
    data: leads,
    meta: toMeta(body, leads.length),
  };
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

export async function exportLeadsCsv() {
  const { data } = await api.get<Blob>("/api/leads/export/csv", { responseType: "blob" });
  return data;
}

export function calcStats(leads: Lead[]): LeadsStats {
  const safeLeads = Array.isArray(leads) ? leads : [];
  return {
    total: safeLeads.length,
    qualified: safeLeads.filter((lead) => lead.status === "qualified").length,
    new: safeLeads.filter((lead) => lead.status === "new").length,
    contacted: safeLeads.filter((lead) => lead.status === "contacted").length,
    lost: safeLeads.filter((lead) => lead.status === "lost").length,
  };
}
