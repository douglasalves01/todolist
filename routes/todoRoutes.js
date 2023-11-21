import express, { Router } from "express";
import { checkToken } from "../db/conn.js";
import { TodoController } from "../controller/TodoController.js";

export const todoRouter = express.Router();

todoRouter.get("/dashboard", checkToken, TodoController.showTodos);
todoRouter.get("/todo", checkToken, TodoController.createTodo);
todoRouter.post("/todo", checkToken, TodoController.createTodoSave);
