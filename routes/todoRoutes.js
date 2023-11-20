import express, { Router } from "express";
import { checkToken } from "../db/conn.js";
import { TodoController } from "../controller/TodoController.js";

export const todoRouter = express.Router();

todoRouter.get("/dashboard", checkToken, TodoController.showTodo);
todoRouter.get("/createTodo", checkToken, TodoController.createTodo);
todoRouter.post("/createTodo", checkToken, TodoController.createTodoSave);
