import { z } from "zod";

const leadStatusEnum = z.enum(["new", "contacted", "qualified", "lost"]);
const leadSourceEnum = z.enum(["website", "instagram", "referral"]);

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Please provide a valid email"),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
});

export const updateLeadSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z.email("Please provide a valid email").optional(),
    status: leadStatusEnum.optional(),
    source: leadSourceEnum.optional(),
  })
  .refine(
    (payload) =>
      payload.name !== undefined ||
      payload.email !== undefined ||
      payload.status !== undefined ||
      payload.source !== undefined,
    { message: "At least one field is required for update" }
  );
