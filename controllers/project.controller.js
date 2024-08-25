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
route.post("/", authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { name, description, link_project } = req.body;
        const image = req.file ? req.file.filename : null;

        const newProject = await Project.create({
            name,
            description,
            link_project,
            image
        });

        res.status(201).json({
            message: "Project created successfully",
            data: newProject
        });
    } catch (error) {
        console.error('Error creating project:', error); // Log detailed error
        res.status(500).json({
            message: "Error creating project",
            error: error.message
        });
    }
});

// PUT request to update an existing project (authentication required)
route.put("/:id", authenticateToken, upload.single('image'), updateProject);

// DELETE request to delete a project by ID (authentication required)
route.delete("/:id", authenticateToken, deleteProject);

module.exports = route;
