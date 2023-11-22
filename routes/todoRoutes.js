import express, { Router } from "express";
import { checkToken } from "../helpers/user.js";
import { TodoController } from "../controller/TodoController.js";

export const todoRouter = express.Router();

todoRouter.get("/todo", checkToken, TodoController.createTodo);
todoRouter.post("/todo", checkToken, TodoController.createTodoPost);
