import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API Running Successfully",
  });
});

export default app;