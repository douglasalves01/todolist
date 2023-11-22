import express from "express";
import jwt from "jsonwebtoken";
import { executaSql, retornarDados, excluirDados } from "../helpers/banco.js";

export class DashboardController {
  static async showDados(req, res) {
    const secret = process.env.SECRET;
    const token = req.cookies.jwt;
    let ident = jwt.verify(token, secret);
    let id_user = ident.id;

    try {
      const selectSql = `SELECT
      (SELECT COUNT(ID_TODO) FROM TODOS WHERE ID_USER = '${id_user}'),
      (SELECT COUNT(ID_TODO) FROM TODOS WHERE ID_USER = '${id_user}' AND ID_CATEGORIA IS NULL),
      (SELECT COUNT(ID_TODO) FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO < TRUNC(SYSDATE)),
      (SELECT COUNT(ID_TODO) FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO >= TRUNC(SYSDATE)),
      (SELECT COUNT(ID_TODO) FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO IS NULL),
      (SELECT COUNT(ID_TODO) FROM TODOS WHERE ID_USER = '${id_user}' AND REMOVIDO = 1)
       FROM DUAL`;

      const result = await retornarDados(selectSql, [], "Dados");

      let dados;

      if (result) {
        dados = result.map((item) => ({
          qtdeGeral: item[0],
          qtdeSemCategoria: item[1],
          qtdeVencida: item[2],
          qtdePrazo: item[3],
          qtdeSemPrazo: item[4],
          qtdeRemovida: item[5],
        }));
      }
      res.render("dashboard", { quantidades: dados });
    } catch (error) {
      console.log(error);
    }
    res.render("dashboard");
  }
}
