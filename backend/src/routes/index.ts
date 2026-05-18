import { Router } from "express";
import authRouter from "./authRoutes";
import leadRouter from "./leadRoutes";

const router = Router();

router.use("/auth", authRouter);
router.use("/leads", leadRouter);

export default router;
