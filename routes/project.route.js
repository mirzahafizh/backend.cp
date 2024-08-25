const express = require('express');
const route = express.Router();
const { createProject, updateProject, getAllProjects, getProjectById, deleteProject } = require('../controllers/project.controller');
const { authenticateToken } = require('../middleware/authenticateToken');
const upload = require('../middleware/uploads'); // Middleware for handling file uploads

// GET all projects
route.get("/", getAllProjects);

// GET a single project by ID
route.get("/:id", getProjectById);

// POST request to create a new project (authentication required)
route.post("/", authenticateToken, upload.single('image'), createProject);

// PUT request to update an existing project (authentication required)
route.put("/:id", authenticateToken, upload.single('image'), updateProject);

// DELETE request to delete a project by ID (authentication required)
route.delete("/:id", authenticateToken, deleteProject);

module.exports = route;
