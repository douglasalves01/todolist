import express from "express";
import jwt from "jsonwebtoken";
import { executaSql, retornarDados, excluirDados } from "../helpers/banco.js";

export class CategoriaController {
  static async createCategoria(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;
      const selectSql = `
        SELECT * FROM CATEGORIAS WHERE ID_USER = '${id_user}'`;

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
  }
  static async createCategoriaPost(req, res) {
    const secret = process.env.SECRET;
    const token = req.cookies.jwt;
    let ident = jwt.verify(token, secret);
    let id_user = ident.id;
    const categoria = req.body.categoria;
    const sql = `SELECT * FROM CATEGORIAS WHERE DESCRICAO = '${categoria}' AND ID_USER = '${id_user}'`;
    const result = await retornarDados(sql, []);
    const sql2 = `INSERT INTO CATEGORIAS 
       (ID_CATEGORIA, DESCRICAO, ID_USER )
       VALUES
       (SEQ_CATEGORIA.NEXTVAL, :1,:2)`;
    const dados = [categoria, id_user];
    try {
      if (categoria.length < 5) {
        res.status(400).send("categoria deve ter no mínimo 5 caracteres");
      }
      if (result.length === 0) {
        //cadastrar categoria
        executaSql(sql2, dados);
      } else {
        res.status(400).send("Essa categoria já está cadastrada");
      }
    } catch (error) {
      console.log(error);
    }
    res.redirect("/categoria");
  }
  static async updateCategoria(req, res) {
    const idCategoria = req.params.id;
    const descricao = req.body.descricao;
  }
  static async deleteCategoria(req, res) {
    const idCategoria = req.params.id;

    const sql = `DELETE FROM CATEGORIAS WHERE ID_CATEGORIA = '${idCategoria}'`;

    try {
      await excluirDados(sql);
    } catch (error) {
      res
        .status(500)
        .json({ status: "ERROR", message: `Erro na exclusão: Erro` });
    } finally {
      res.redirect("/categoria");
    }
  }
}
