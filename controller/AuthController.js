import express from "express";
import bcryptjs from "bcryptjs";
import { signIn } from "../helpers/user.js";
import { executaSql, retornarDados } from "../helpers/banco.js";
export class AuthController {
  static login(req, res) {
    //apenas renderização da página
    res.render("auth/login");
  }
  static async loginPost(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const sql = `SELECT * FROM USERS WHERE EMAIL = '${email}'`; //select que será usado para verificar se existe o email cadastrado no banco
    const result = await retornarDados(sql, []);

    if (result.length === 0) {
      return res.status(422).json({ msg: "Por favor, utilize outro e-mail" });
    } else {
      let dados;
      if (result) {
        dados = result.map((item) => ({
          //percorrendo o retorno e atribuindo valores em um novo array
          id: item[0],
          userPassword: item[2],
        }));
      }
      dados.forEach((item) => {
        signIn(req, res, password, item.userPassword, item.id); //logando o usuário no sistema
      });
    }
  }
  static register(req, res) {
    //apenas renderização da página
    res.render("auth/register");
  }
  static async registerPost(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const salt = await bcryptjs.genSalt(12); //configurando o salt para dificultar o hash
    let passwordHash = await bcryptjs.hash(password, salt); //criptografando a senha(hash)
    //select para cadastrar um novo usuário
    const sqlUser = `INSERT INTO USERS 
         (ID_USER, EMAIL, PASSWORD )
         VALUES
         (SEQ_USER.NEXTVAL, :1, :2)`;
    const dados = [email, passwordHash];
    try {
      //verificação para prever ambiguidade nas informações de senha e confirma
      if (password != confirmPassword) {
        return res.status(422).json({ msg: "As senhas não conferem!" });
      }
      //select para ser usado para verificar se já existe esse email cadastrado no sistema
      const sql = `SELECT * FROM USERS WHERE EMAIL = '${email}'`;
      const result = await retornarDados(sql, []); //verificando se existe o email já cadastrado
      if (result.length === 0) {
        executaSql(sqlUser, dados); //criando um usuário novo
      } else {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail" });
      }
    } catch (error) {
      console.log(error);
    }
    res.redirect("/login");
  }
  static logout(req, res) {
    //limpar o cookie salvo
    res.clearCookie("jwt");
    res.redirect("/login");
  }
}
