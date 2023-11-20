import express from "express";

export class TodoController {
  static showTodo(req, res) {
    res.render("todo/dashboard");
  }
  static createTodo(req, res) {
    res.render("todo");
  }
  static async createTodoSave(req, res) {}
}
