import express from "express";
import bcryptjs from "bcryptjs";
import { signIn } from "../helpers/user.js";
import { executaSql, retornarDados } from "../helpers/banco.js";
export class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }
  static async loginPost(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const sql = `SELECT * FROM USERS WHERE EMAIL = '${email}'`;
    const result = await retornarDados(sql, []);

    if (result.length === 0) {
      return res.status(422).json({ msg: "Por favor, utilize outro e-mail" });
    } else {
      let dados;
      if (result) {
        dados = result.map((item) => ({
          id: item[0],
          userPassword: item[2],
        }));
      }
      dados.forEach((item) => {
        signIn(req, res, password, item.userPassword, item.id);
      });
    }
  }
  static register(req, res) {
    res.render("auth/register");
  }
  static async registerPost(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const salt = await bcryptjs.genSalt(12);
    let passwordHash = await bcryptjs.hash(password, salt);
    const sqlUser = `INSERT INTO USERS 
         (ID_USER, EMAIL, PASSWORD )
         VALUES
         (SEQ_USER.NEXTVAL, :1, :2)`;
    const dados = [email, passwordHash];
    try {
      if (password != confirmPassword) {
        return res.status(422).json({ msg: "As senhas não conferem!" });
      }
      const sql = `SELECT * FROM USERS WHERE EMAIL = '${email}'`;
      const result = await retornarDados(sql, []);
      if (result.length === 0) {
        executaSql(sqlUser, dados);
      } else {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail" });
      }
    } catch (error) {
      console.log(error);
    }
    res.render("auth/register");
  }
  static logout(req, res) {
    res.clearCookie("jwt");
    res.redirect("/login");
  }
}
