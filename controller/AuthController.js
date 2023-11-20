import express from "express";
import { criarUsuario, retornarDados, validarSenha } from "../db/conn.js";

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
        validarSenha(req, res, password, item.userPassword, item.id);
      });
    }
    res.render("auth/login");
  }
  static register(req, res) {
    res.render("auth/register");
  }
  static async registerPost(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    try {
      if (password != confirmPassword) {
        return res.status(422).json({ msg: "As senhas não conferem!" });
      }
      const sql = `SELECT * FROM USERS WHERE EMAIL = '${email}'`;
      const result = await retornarDados(sql, []);
      if (result.length === 0) {
        criarUsuario(email, password);
      } else {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail" });
      }
    } catch (error) {
      console.log(error);
    }
    res.render("auth/register");
  }
}
