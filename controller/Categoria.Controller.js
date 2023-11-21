import express from "express";
import { criarCategoria, retornarDados } from "../db/conn.js";

export class CategoriaController {
  static async createCategoria(req, res) {
    try {
      const selectSql = `
        SELECT * FROM CATEGORIAS`;

      const result = await retornarDados(selectSql, []);

      let dados;
      if (result) {
        dados = result.map((item) => ({
          idCategoria: item[0],
          descricao: item[1],
        }));
      }

      res.render("categoria/createCategoria", { categorias: dados });
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      } else {
        cr.message = "Erro ao conectar ao oracle. Sem detalhes";
      }
    }
    res.render("categoria/createCategoria");
  }
  static async createCategoriaPost(req, res) {
    const categoria = req.body.categoria;
    const sql = `SELECT * FROM CATEGORIAS WHERE DESCRICAO = '${categoria}'`;
    const result = await retornarDados(sql, []);
    try {
      if (categoria.length < 4) {
        res.status(400).send("categoria deve ter no mínimo 4 caracteres");
      }
      if (result.length === 0) {
        //cadastrar categoria
        criarCategoria(categoria);
      } else {
        res.status(400).send("Essa categoria já está cadastrada");
      }
    } catch (error) {
      console.log(error);
    }
    res.redirect("/categoria");
  }
}
