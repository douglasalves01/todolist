import express from "express";
import { checkToken } from "../helpers/user.js";
import { ShowController } from "../controller/ShowController.js";

export const showRouter = express.Router();
// rotas com filtros de to-dos
showRouter.get("/todo/geral", checkToken, ShowController.todoGeral);
showRouter.get(
  "/todo/semcategoria",
  checkToken,
  ShowController.todoSemCategoria
);
showRouter.get("/todo/vencida", checkToken, ShowController.todoVencida);
showRouter.get("/todo/prazo", checkToken, ShowController.todoPrazo);
showRouter.get("/todo/semprazo", checkToken, ShowController.todoSemPrazo);
showRouter.get("/todo/removida", checkToken, ShowController.todoRemovida);
