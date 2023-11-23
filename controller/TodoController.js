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
        SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND REMOVIDO = 0`;

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
    const removido = 0; //status de removido pré-definido como 0(não removido)
    const contemApenasNumeros = /^\d+$/.test(titulo); //usado para verificar se o input só continha números
    const secret = process.env.SECRET;
    const token = req.cookies.jwt;
    let ident = jwt.verify(token, secret); //validando token
    let id_user = ident.id;
    let hoje = new Date();
    //select para verificar se já existe uma to-do cadastrada com esse título(para o usuário logado)
    const sql = `SELECT * FROM TODOS WHERE TITULO = '${titulo}' AND ID_USER = '${id_user}'`;
    const result = await retornarDados(sql, []); //esse result vai ser para verificar se existe uma to-do com o mesmo título já cadastrada

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
        //verificando se o campo só tinha números
        res.status(400).send("título não pode contem somente número");
      }
      if (titulo.length < 4) {
        //título não pode ter menos de 4 caracteres
        res.status(400).send("título deve ter no mínimo 4 caracteres");
      }
      if (descricao.length < 20) {
        //descrição não pode ter menos de 20 caracteres
        res.status(400).send("descrição deve ter no mínimo 20 caracteres");
      }

      let dataVencimento = new Date(vencimento);
      if (dataVencimento < hoje && vencimento !== null) {
        //verificando se a data inserido é anterior a data atual de cadastro
        res
          .status(400)
          .send("A data de cadastro não pode ser anterior ao dia de hoje");
      }
      //select para cadastrar uma to-do
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
        //verificando se existe/ não existe uma to-do com o mesmo título já cadastrada
        executaSql(sql2, dados);
      } else {
        res.status(400).send("Essa categoria já está cadastrada");
      }
    } catch (error) {
      console.log(error);
    }
    res.redirect("/todo");
  }
  static async updateTodo(req, res) {
    res.render("todo/editTodo");
  }
  static async updateTodoPost(req, res) {
    res.render("todo/editTodo");
  }
  static async deleteTodo(req, res) {
    const idTodo = req.params.id;
    const secret = process.env.SECRET;
    const token = req.cookies.jwt;
    let ident = jwt.verify(token, secret); //validando token
    let id_user = ident.id;
    //select usado para mudar o status da to-do para removida(soft delete)
    const sql = `UPDATE TODOS SET REMOVIDO =1 WHERE ID_TODO= '${idTodo}' AND ID_USER = ${id_user}`;

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
  static async recuperarTodo(req, res) {
    const idTodo = req.params.id;
    const secret = process.env.SECRET;
    const token = req.cookies.jwt; //pegando token do cookie
    let ident = jwt.verify(token, secret); //verificando se o token é válido
    let id_user = ident.id; //pegando o id usuário pelo token

    //select usado para atualizar to-do(removido) para 0(status para não removido)
    const sql = `UPDATE TODOS SET REMOVIDO =0 WHERE ID_TODO= '${idTodo}' AND ID_USER = ${id_user}`;

    try {
      await excluirDados(sql);
    } catch (error) {
      res
        .status(500)
        .json({ status: "ERROR", message: `Erro na exclusão: Erro` });
    } finally {
      res.redirect("/todo/removida");
    }
  }
}
