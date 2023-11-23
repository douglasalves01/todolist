import oracledb from "oracledb";
import * as dotenv from "dotenv";

dotenv.config();

export let conn = oracledb.getConnection({
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_STR,
});
