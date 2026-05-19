export type LeadStatus = "new" | "qualified" | "contacted" | "lost";

export interface LeadTimelineItem {
  title: string;
  description?: string;
  time?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  location?: string;
  assignedTo?: string;
  timeline?: LeadTimelineItem[];
}

export interface LeadsMeta {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface LeadsStats {
  total: number;
  qualified: number;
  new: number;
  contacted: number;
  lost: number;
}

export interface LeadsListResponse {
  data: Lead[];
  meta: LeadsMeta;
  stats?: LeadsStats;
}

export interface LeadsQuery {
  page: number;
  search: string;
  status: string;
  source: string;
  sort: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  status: LeadStatus;
  source: string;
}
