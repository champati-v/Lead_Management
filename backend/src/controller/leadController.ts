import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  createLead as createLeadService,
  deleteLead as deleteLeadService,
  exportLeadsCSV,
  getLeadById as getLeadByIdService,
  getLeads as getLeadsService,
  updateLead as updateLeadService,
} from "../services/leadService";

const getParamId = (req: Request): string => {
  const { id } = req.params as { id?: string | string[] };
  if (Array.isArray(id)) {
    return id[0] ?? "";
  }
  return id ?? "";
};

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser) {
    const error = new Error("Unauthorized access") as Error & { statusCode?: number };
    error.statusCode = 401;
    throw error;
  }

  const { name, email, status, source } = req.body as {
    name: string;
    email: string;
    status?: "new" | "contacted" | "qualified" | "lost";
    source?: "website" | "instagram" | "referral";
  };

  const lead = await createLeadService({
    name,
    email,
    status,
    source,
    createdBy: currentUser._id.toString(),
  });

  res.status(201).json({
    success: true,
    message: "Lead created successfully",
    data: lead,
  });
});

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, search, sort, page } = req.query as {
    status?: string;
    source?: string;
    search?: string;
    sort?: string;
    page?: string;
  };

  const data = await getLeadsService({ status, source, search, sort, page });

  res.status(200).json({
    success: true,
    message: "Leads fetched successfully",
    data,
  });
});

export const getLeadById = asyncHandler(async (req: Request, res: Response) => {
  const lead = await getLeadByIdService(getParamId(req));

  res.status(200).json({
    success: true,
    message: "Lead fetched successfully",
    data: lead,
  });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, status, source } = req.body as {
    name?: string;
    email?: string;
    status?: "new" | "contacted" | "qualified" | "lost";
    source?: "website" | "instagram" | "referral";
  };

  const lead = await updateLeadService(getParamId(req), { name, email, status, source });

  res.status(200).json({
    success: true,
    message: "Lead updated successfully",
    data: lead,
  });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  await deleteLeadService(getParamId(req));

  res.status(200).json({
    success: true,
    message: "Lead deleted successfully",
    data: null,
  });
});

export const exportCSV = asyncHandler(async (req: Request, res: Response) => {
  const { status, source, search, sort } = req.query as {
    status?: string;
    source?: string;
    search?: string;
    sort?: string;
  };

  const csv = await exportLeadsCSV({ status, source, search, sort });

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
  res.status(200).send(csv);
});
