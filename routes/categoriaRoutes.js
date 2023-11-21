import express from "express";
import { CategoriaController } from "../controller/Categoria.Controller.js";
import { checkToken } from "../db/conn.js";

export const categoriaRouter = express.Router();

categoriaRouter.get(
  "/categoria",
  checkToken,
  CategoriaController.createCategoria
);
categoriaRouter.post(
  "/categoria",
  checkToken,
  CategoriaController.createCategoriaPost
);
