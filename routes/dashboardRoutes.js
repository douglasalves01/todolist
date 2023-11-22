import express from "express";
import { checkToken } from "../helpers/user.js";
import { DashboardController } from "../controller/DashboardController.js";

export const dashRouter = express.Router();

dashRouter.get("/dashboard", checkToken, DashboardController.showDados);
