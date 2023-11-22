import express from "express";
import jwt from "jsonwebtoken";
import { executaSql, retornarDados, excluirDados } from "../helpers/banco.js";

export class DashboardController {
  static async showDados(req, res) {
    res.render("dashboard");
  }
}
