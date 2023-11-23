import express from "express";
import { checkToken } from "../helpers/user.js";
import { TodoController } from "../controller/TodoController.js";

export const todoRouter = express.Router();

todoRouter.get("/todo", checkToken, TodoController.createTodo);
todoRouter.post("/todo", checkToken, TodoController.createTodoPost);
todoRouter.get("/editTodo/:id", checkToken, TodoController.updateTodo);
todoRouter.post("/editTodo/:id", checkToken, TodoController.updateTodoPost);
todoRouter.post("/deleteTodo/:id", checkToken, TodoController.deleteTodo);
todoRouter.post("/recuperarTodo/:id", checkToken, TodoController.recuperarTodo);
