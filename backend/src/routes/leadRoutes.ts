import { Router } from "express";
import {
  createLead,
  deleteLead,
  exportCSV,
  getLeadById,
  getLeads,
  updateLead,
} from "../controller/leadController";
import authMiddleware from "../middlewares/authMiddleware";
import authorizeRoles from "../middlewares/roleMiddleware";
import validateBody from "../middlewares/validateMiddleware";
import { createLeadSchema, updateLeadSchema } from "../validations/leadValidation";

const leadRouter = Router();

leadRouter.use(authMiddleware);

leadRouter.post("/", validateBody(createLeadSchema), createLead);
leadRouter.get("/", getLeads);
leadRouter.get("/export/csv", authorizeRoles("admin"), exportCSV);
leadRouter.get("/:id", getLeadById);
leadRouter.patch("/:id", validateBody(updateLeadSchema), updateLead);
leadRouter.delete("/:id", authorizeRoles("admin"), deleteLead);

export default leadRouter;
