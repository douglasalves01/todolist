import express from "express";

export class CategoriaController {
  static createCategoria(req, res) {
    res.render("categoria/createCategoria");
  }
  static async createCategoriaPost(req, res) {
    const categoria = req.body.categoria;
    console.log(categoria);
  }
}
