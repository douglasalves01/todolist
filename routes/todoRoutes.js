import express, { Router } from "express";
import { checkToken } from "../helpers/user.js";
import { TodoController } from "../controller/TodoController.js";

export const todoRouter = express.Router();

todoRouter.get("/todo", checkToken, TodoController.createTodo);
todoRouter.post("/todo", checkToken, TodoController.createTodoPost);
todoRouter.post("/deleteTodo/:id", checkToken, TodoController.deleteTodo);
todoRouter.post("/recuperarTodo/:id", checkToken, TodoController.recuperarTodo);

// rotas com filtros de to-dos
todoRouter.get("/todo/geral", checkToken, TodoController.todoGeral);
todoRouter.get(
  "/todo/semcategoria",
  checkToken,
  TodoController.todoSemCategoria
);
todoRouter.get("/todo/vencida", checkToken, TodoController.todoVencida);
todoRouter.get("/todo/prazo", checkToken, TodoController.todoPrazo);
todoRouter.get("/todo/semprazo", checkToken, TodoController.todoSemPrazo);
todoRouter.get("/todo/removida", checkToken, TodoController.todoRemovida);
