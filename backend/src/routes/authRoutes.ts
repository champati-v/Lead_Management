import { Router } from "express";
import { getMe, login, register } from "../controller/authController";
import authMiddleware from "../middlewares/authMiddleware";
import validateBody from "../middlewares/validateMiddleware";
import { loginSchema, registerSchema } from "../validations/authValidation";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.get("/me", authMiddleware, getMe);

export default authRouter;
