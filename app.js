import express from "express";
import { create } from "express-handlebars";
import { conn } from "./db/conn.js";
import { authRouter } from "./routes/authRoutes.js";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
const hbs = create({
  partialsDir: ["views/partials"],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public/"));

app.get("/home", (req, res) => {
  res.render("home");
});

app.use("/", authRouter);

app.listen(3333, async () => {
  try {
    if (await conn) {
      console.log("App funcionando em http://localhost:3333/home");
    }
  } catch (error) {
    console.log(error);
  }
});
