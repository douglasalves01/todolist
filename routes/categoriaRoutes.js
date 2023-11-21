import express from "express";
import { CategoriaController } from "../controller/Categoria.Controller.js";
import { checkToken } from "../helpers/user.js";

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
categoriaRouter.post(
  "/categoria/:id",
  checkToken,
  CategoriaController.updateCategoria
);
categoriaRouter.post(
  "/deleteCategoria/:id",
  checkToken,
  CategoriaController.deleteCategoria
);
