import oracledb from "oracledb";
import bcryptjs from "bcryptjs";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export let conn = oracledb.getConnection({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_STR,
});
export async function criarUsuario(email, password) {
  try {
    const salt = await bcryptjs.genSalt(12);
    let passwordHash = await bcryptjs.hash(password, salt);
    const sql = `INSERT INTO USERS 
       (ID_USER, EMAIL, PASSWORD )
       VALUES
       (SEQ_USER.NEXTVAL, :1, :2)`;
    const dados = [email, passwordHash];
    let resSql = await (await conn).execute(sql, dados);

    await (await conn).commit();

    const rowsInserted = resSql.rowsAffected;
    if (rowsInserted !== undefined && rowsInserted === 1) {
      console.log("Dados inseridos");
    } else if (rowsInserted === undefined) {
      console.log("Nenhum dado inserido");
    }
  } catch (error) {
    console.log("Erro na execução do sql", error);
  }
}
export async function retornarDados(sql, dados) {
  try {
    let resSql = await (await conn).execute(sql, dados);
    return resSql.rows;
  } catch (e) {
    console.log("erro na consulta sql", cr);
  }
}
export async function validarSenha(req, res, password, userPassword, id) {
  const checkPassword = await bcryptjs.compare(password, userPassword);
  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }
  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({ id: id }, secret);
    res.cookie("jwt", token, {
      maxAge: 3600000,
      httpOnly: true,
    });
    // res.status(200).json({ msg: "Autenticação reaizada com sucesso", token });
  } catch (err) {
    console.log(err);
  }
}
export function checkToken(req, res, next) {
  // const authHeader = req.headers["authorization"];
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}
