import { Parser } from "json2csv";
import { SortOrder, Types } from "mongoose";
import Lead, { ILead, LeadSource, LeadStatus } from "../models/leadModel";

interface ServiceError extends Error {
  statusCode?: number;
}

const createServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

interface CreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source?: LeadSource;
  createdBy: string;
}

interface UpdateLeadInput {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

interface LeadQueryParams {
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
  page?: string;
}

interface LeadsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeadsListResponse {
  leads: ILead[];
  pagination: LeadsPagination;
}

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "lost"];
const LEAD_SOURCES: LeadSource[] = ["website", "instagram", "referral"];

interface LeadSearchQuery {
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

const buildLeadQuery = (params: LeadQueryParams): LeadSearchQuery => {
  const query: LeadSearchQuery = {};

  if (params.status && LEAD_STATUSES.includes(params.status as LeadStatus)) {
    query.status = params.status as LeadStatus;
  }

  if (params.source && LEAD_SOURCES.includes(params.source as LeadSource)) {
    query.source = params.source as LeadSource;
  }

  if (params.search) {
    query.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { email: { $regex: params.search, $options: "i" } },
    ];
  }

  return query;
};

const parsePage = (page?: string): number => {
  const pageNumber = Number(page);
  if (!Number.isFinite(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return Math.floor(pageNumber);
};

const getSortOrder = (sort?: string): Record<string, SortOrder> => {
  if (sort === "oldest") {
    return { createdAt: 1 };
  }
  return { createdAt: -1 };
};

export const createLead = async ({
  name,
  email,
  status,
  source,
  createdBy,
}: CreateLeadInput): Promise<ILead> => {
  if (!name || !email) {
    throw createServiceError("Name and email are required", 400);
  }

  const normalizedEmail = email.toLowerCase();
  const existingLead = await Lead.findOne({ email: normalizedEmail });
  if (existingLead) {
    throw createServiceError("Lead with this email already exists", 409);
  }

  let lead: ILead;
  try {
    lead = await Lead.create({
      name,
      email: normalizedEmail,
      status,
      source,
      createdBy: new Types.ObjectId(createdBy),
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      throw createServiceError("Lead with this email already exists", 409);
    }
    throw error;
  }

  return lead;
};

export const getLeads = async (params: LeadQueryParams): Promise<LeadsListResponse> => {
  const query = buildLeadQuery(params);
  const sortQuery = getSortOrder(params.sort);
  const page = parsePage(params.page);
  const limit = 10;
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    Lead.find(query).sort(sortQuery).skip(skip).limit(limit),
    Lead.countDocuments(query),
  ]);

  return {
    leads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getLeadById = async (id: string): Promise<ILead> => {
  const lead = await Lead.findById(id);
  if (!lead) {
    throw createServiceError("Lead not found", 404);
  }
  return lead;
};

export const updateLead = async (id: string, payload: UpdateLeadInput): Promise<ILead> => {
  if (payload.email) {
    payload.email = payload.email.toLowerCase();
  }

  const updatedLead = await Lead.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedLead) {
    throw createServiceError("Lead not found", 404);
  }

  return updatedLead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const deletedLead = await Lead.findByIdAndDelete(id);
  if (!deletedLead) {
    throw createServiceError("Lead not found", 404);
  }
};

export const exportLeadsCSV = async (params: LeadQueryParams): Promise<string> => {
  const query = buildLeadQuery(params);
  const sortQuery = getSortOrder(params.sort);

  const leads = await Lead.find(query).sort(sortQuery);

  const rows = leads.map((lead) => ({
    id: lead._id.toString(),
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdBy: lead.createdBy.toString(),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  }));

  const parser = new Parser({
    fields: ["id", "name", "email", "status", "source", "createdBy", "createdAt", "updatedAt"],
  });

  return parser.parse(rows);
};
