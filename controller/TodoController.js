import express from "express";
import jwt from "jsonwebtoken";
import { retornarDados, executaSql } from "../helpers/banco.js";

export class TodoController {
  static showTodos(req, res) {
    res.render("todo/dashboard");
  }
  static async createTodo(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;
      const sql = `SELECT * FROM CATEGORIAS WHERE ID_USER = '${id_user}'`;
      const result = await retornarDados(sql, []);

      let dados;
      if (result) {
        dados = result.map((item) => ({
          idCategoria: item[0],
          descricao: item[1],
        }));
      }
      res.render("todo/createTodo", { categorias: dados });
    } catch (error) {
      console.log(error);
    }
  }
  static async createTodoPost(req, res) {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    let vencimento = req.body.vencimento;
    let idCategoria = req.body.idCategoria;
    const removido = 0;
    const contemApenasNumeros = /^\d+$/.test(titulo);
    const secret = process.env.SECRET;
    const token = req.cookies.jwt;
    let ident = jwt.verify(token, secret);
    let id_user = ident.id;
    const sql = `SELECT * FROM TODOS WHERE TITULO = '${titulo}' AND ID_USER = '${id_user}'`;

    const result = await retornarDados(sql, []);
    try {
      if (vencimento === "") {
        vencimento = null;
      }
      if (idCategoria === "sem") {
        idCategoria = null;
      } else {
        idCategoria = parseInt(req.body.idCategoria, 10);
      }
      if (contemApenasNumeros) {
        res.status(400).send("título não pode contem somente número");
      }
      if (titulo.length < 4) {
        res.status(400).send("título deve ter no mínimo 4 caracteres");
      }
      if (descricao.length < 20) {
        res.status(400).send("descrição deve ter no mínimo 20 caracteres");
      }
      const sql2 = `INSERT INTO TODOS 
      (ID_TODO, TITULO, DESCRICAO,VENCIMENTO,REMOVIDO,ID_CATEGORIA,ID_USER )
      VALUES
      (SEQ_TODO.NEXTVAL, :1,:2,TO_DATE(:3, 'YYYY-MM-DD'),:4,:5,:6)`;
      const dados = [
        titulo,
        descricao,
        vencimento,
        removido,
        idCategoria,
        id_user,
      ];

      if (result.length === 0) {
        //confirmando repetição de titulo
        executaSql(sql2, dados);
      } else {
        res.status(400).send("Essa categoria já está cadastrada");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
