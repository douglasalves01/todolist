import { conn } from "../db/conn.js";
export async function retornarDados(sql, dados) {
  try {
    let resSql = await (await conn).execute(sql, dados);
    return resSql.rows;
  } catch (error) {
    console.log("erro na consulta sql", error);
  }
}
export async function executaSql(sql, dados) {
  try {
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
export async function excluirDados(sql) {
  try {
    const result = await (await conn).execute(sql);
    await (await conn).commit();
    console.log("Exclusão SQL executada com sucesso");
    return result.rowsAffected;
  } catch (error) {
    console.error("Erro na exclusão SQL:", error);
    throw error;
  }
}
