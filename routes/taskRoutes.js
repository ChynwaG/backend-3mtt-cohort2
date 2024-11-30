import express from "express";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";
import User from "../models/User.js";

const router = express.Router();

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });
  if (!token.startsWith('Bearer ')) {
    return res.status(400).json({ message: "Invalid token format" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Create Task
router.post("/", authenticate, async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
    const task = new Task({
      user: req.user.id,
      title,
      description,
      deadline,
      priority,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Tasks
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Task
router.put("/:id", authenticate, async (req, res) => {
  const { title, description, deadline, priority } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline, priority },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Task
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
