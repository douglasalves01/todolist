import express from "express";
import { create } from "express-handlebars";
import { conn } from "./db/conn.js";
import { checkToken } from "./helpers/user.js";
import { authRouter } from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { todoRouter } from "./routes/todoRoutes.js";
import { categoriaRouter } from "./routes/categoriaRoutes.js";
import { dashRouter } from "./routes/dashboardRoutes.js";
import { showRouter } from "./routes/showRoutes.js";
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());
//configurando o handlebars
const hbs = create({
  partialsDir: ["views/partials"],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public/")); //configurando acesso a pasta public

app.use((req, res, next) => {
  if (checkToken) {
    //fiz isso pra passar o if no template do navbar(main)
    res.locals.jwt = req.cookies.jwt || null; // Defina res.locals.jwt com o valor do cookie jwt ou null se não existir
  }
  next();
});
//acesso as variáveis de rotas
app.use("/", authRouter);
app.use("/", todoRouter);
app.use("/", categoriaRouter);
app.use("/", dashRouter);
app.use("/", showRouter);

app.listen(3333, async () => {
  try {
    if (await conn) {
      console.log("App funcionando em http://localhost:3333/login");
    }
  } catch (error) {
    console.log(error);
  }
});
