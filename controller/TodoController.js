import express from "express";
import jwt from "jsonwebtoken";
import { retornarDados, executaSql, excluirDados } from "../helpers/banco.js";

export class TodoController {
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
      const selectSql = `
        SELECT * FROM TODOS WHERE ID_USER = '${id_user}'`;

      const result2 = await retornarDados(selectSql, []);
      let dados2;
      if (result2) {
        dados2 = result2.map((item) => ({
          idTodo: item[0],
          titulo: item[1],
          descricao: item[2],
          vencimento: item[3],
          removido: item[4],
          idCategoria: item[5],
          idUser: item[6],
        }));

        //console.log(dados[0]);
        //console.log(dados);
      }
      res.render("todo/createTodo", { categorias: dados, todos: dados2 });
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
    let hoje = new Date();
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

      let dataVencimento = new Date(vencimento);
      if (dataVencimento < hoje && vencimento !== null) {
        res
          .status(400)
          .send("A data de cadastro não pode ser anterior ao dia de hoje");
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
    res.redirect("/todo");
  }
  static async deleteTodo(req, res) {
    const idTodo = req.params.id;

    const sql = `DELETE FROM TODOS WHERE ID_TODO = '${idTodo}'`;

    try {
      await excluirDados(sql);
    } catch (error) {
      res
        .status(500)
        .json({ status: "ERROR", message: `Erro na exclusão: Erro` });
    } finally {
      res.redirect("/todo");
    }
  }
  static async todoGeral(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;

      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}'`;

      const result = await retornarDados(selectSql, []);
      let dados;
      if (result) {
        dados = result.map((item) => ({
          idTodo: item[0],
          titulo: item[1],
          descricao: item[2],
          vencimento: item[3],
          removido: item[4],
          categoria: item[5],
          idUser: item[6],
        }));

        //console.log(dados[0]);
        //console.log(dados);
      }
      res.render("visualizar/geral", { todos: dados });
    } catch (error) {
      console.log(error);
    }
  }
  static async todoSemCategoria(req, res) {
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
      const selectSql = `
        SELECT * FROM TODOS WHERE ID_USER = '${id_user}'`;

      const result2 = await retornarDados(selectSql, []);
      let dados2;
      if (result2) {
        dados2 = result2.map((item) => ({
          idTodo: item[0],
          titulo: item[1],
          descricao: item[2],
          vencimento: item[3],
          removido: item[4],
          idCategoria: item[5],
          idUser: item[6],
        }));

        //console.log(dados[0]);
        //console.log(dados);
      }
      res.render("visualizar/semCategoria", {
        categorias: dados,
        todos: dados2,
      });
    } catch (error) {
      console.log(error);
    }
  }
  static async todoVencida(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;

      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO < TRUNC(SYSDATE)`;

      const result = await retornarDados(selectSql, []);
      let dados;
      if (result) {
        dados = result.map((item) => ({
          idTodo: item[0],
          titulo: item[1],
          descricao: item[2],
          vencimento: item[3],
          removido: item[4],
          categoria: item[5],
          idUser: item[6],
        }));

        //console.log(dados[0]);
        //console.log(dados);
      }
      res.render("visualizar/vencida", { todos: dados });
    } catch (error) {
      console.log(error);
    }
  }
  static async todoPrazo(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;

      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO >= TRUNC(SYSDATE)`;

      const result = await retornarDados(selectSql, []);
      let dados;
      if (result) {
        dados = result.map((item) => ({
          idTodo: item[0],
          titulo: item[1],
          descricao: item[2],
          vencimento: item[3],
          removido: item[4],
          categoria: item[5],
          idUser: item[6],
        }));

        //console.log(dados[0]);
        //console.log(dados);
      }
      res.render("visualizar/prazo", { todos: dados });
    } catch (error) {
      console.log(error);
    }
  }
  static async todoSemPrazo(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;

      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO IS NULL`;

      const result = await retornarDados(selectSql, []);
      let dados;
      if (result) {
        dados = result.map((item) => ({
          idTodo: item[0],
          titulo: item[1],
          descricao: item[2],
          vencimento: item[3],
          removido: item[4],
          categoria: item[5],
          idUser: item[6],
        }));

        //console.log(dados[0]);
        //console.log(dados);
      }
      res.render("visualizar/semPrazo", { todos: dados });
    } catch (error) {
      console.log(error);
    }
  }
  static async todoRemovida(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;

      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND REMOVIDO = 1`;

      const result = await retornarDados(selectSql, []);
      let dados;
      if (result) {
        dados = result.map((item) => ({
          idTodo: item[0],
          titulo: item[1],
          descricao: item[2],
          vencimento: item[3],
          removido: item[4],
          categoria: item[5],
          idUser: item[6],
        }));

        //console.log(dados[0]);
        //console.log(dados);
      }
      res.render("visualizar/removida", { todos: dados });
    } catch (error) {
      console.log(error);
    }
  }
}
