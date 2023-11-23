import jwt from "jsonwebtoken";
import { retornarDados } from "../helpers/banco.js";
export class ShowController {
  static async todoGeral(req, res) {
    try {
      const secret = process.env.SECRET;
      const token = req.cookies.jwt;
      let ident = jwt.verify(token, secret);
      let id_user = ident.id;
      //retorna todas as to-dos cadastradas(geral)
      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND REMOVIDO = 0`;

      const result = await retornarDados(selectSql, []);
      console.log(result);
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
      //retornar to-dos que foram cadastradas sem um categoria definida
      const selectSql = `
        SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND ID_CATEGORIA IS NULL AND REMOVIDO =0`;

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
      //retornar to-dos que estão com status de vencida(data cadastrada < data de hoje)
      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO < TRUNC(SYSDATE) AND REMOVIDO =0`;

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
      //retornar to-dos que estão no prazo
      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO >= TRUNC(SYSDATE) AND REMOVIDO =0`;

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
      //retornado to-dos que foram cadastradas sem um prazo definido
      const selectSql = `
      SELECT * FROM TODOS WHERE ID_USER = '${id_user}' AND VENCIMENTO IS NULL AND REMOVIDO =0`;

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
      //select usado para retornar to-dos com status de removido(1)
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
      }
      //renderizando o template e passando os dados para ele
      res.render("visualizar/removida", { todos: dados });
    } catch (error) {
      console.log(error);
    }
  }
}
