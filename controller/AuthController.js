import express from "express";

export class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }
  static async loginPost(req, res) {
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
        console.log("As senhas diferem!");
      }
    } catch (error) {}
    res.render("auth/register");
  }
}
