import express from "express";
import { AuthController } from "../controller/AuthController.js";

export const authRouter = express.Router();

authRouter.get("/login", AuthController.login);
authRouter.post("/login", AuthController.loginPost);
authRouter.get("/register", AuthController.register);
authRouter.post("/register", AuthController.registerPost);
authRouter.get("/logout", AuthController.logout);
