import { conn } from "../db/conn.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signIn(req, res, password, userPassword, id) {
  const checkPassword = await bcryptjs.compare(password, userPassword); //verificando se a senha informado é igual a cadastrada
  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: id }, secret); //gerando um token padrao jwt
    res.cookie("jwt", token, {
      //salvando o token em um cookie
      maxAge: 3600000,
      httpOnly: true,
    });
    res.redirect("/dashboard"); //já redirecionando pra tela de dash
  } catch (err) {
    console.log(err);
  }
}
export function checkToken(req, res, next) {
  const token = req.cookies.jwt; //resgatando o token do cookie
  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret); //verificando se o token está válido
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}
