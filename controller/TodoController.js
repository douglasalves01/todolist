import express from "express";

export class TodoController {
  static showTodos(req, res) {
    res.render("todo/dashboard");
  }
  static createTodo(req, res) {
    res.render("todo/createTodo");
  }
  static async createTodoSave(req, res) {}
}
