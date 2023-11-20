import express from "express";
import { create } from "express-handlebars";
import { conn } from "./db/conn.js";
import { authRouter } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { todoRouter } from "./routes/todoRoutes.js";
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const hbs = create({
  partialsDir: ["views/partials"],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public/"));

app.use((req, res, next) => {
  res.locals.jwt = req.cookies.jwt || null; // Defina res.locals.jwt com o valor do cookie jwt ou null se não existir
  next();
});
app.get("/", (req, res) => {
  // O valor do JWT estará disponível em res.locals.jwt em todas as rotas
  const jwt = res.locals.jwt;
  // Restante da lógica da rota...
});

app.use("/", authRouter);
app.use("/", todoRouter);

app.listen(3333, async () => {
  try {
    if (await conn) {
      console.log("App funcionando em http://localhost:3333/home");
    }
  } catch (error) {
    console.log(error);
  }
});
