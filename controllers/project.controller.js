const { Project } = require('../models');
const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        }
    });
};

module.exports = {
    // Create a new project
    createProject: async (req, res) => {
        try {
            const { name, description, link_project } = req.body;
            const file = req.file;
            let imagePath = null;

            if (file) {
                imagePath = file.path; // Path of the uploaded file
            }

            const newProject = await Project.create({
                name,
                description,
                link_project,
                imagePath
            });

            res.status(201).json({
                message: "Project created successfully",
                data: newProject
            });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({
                message: "Error creating project",
                error: error.message
            });
        }
    },

    // Update an existing project
    updateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, link_project } = req.body;
            const file = req.file;
            let newImagePath = null;

            const project = await Project.findByPk(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (file) {
                // Delete old image from file system
                if (project.imagePath) {
                    deleteFile(project.imagePath);
                }

                // Save new image path
                newImagePath = file.path;
            }

            await project.update({
                name,
                description,
                imagePath: newImagePath || project.imagePath,
                link_project: link_project || project.link_project
            });

            res.json({
                message: "Project updated successfully",
                data: project
            });
        } catch (error) {
            res.status(500).json({
                message: "Error updating project",
                error: error.message
            });
        }
    },

    // Get all projects
    getAllProjects: async (req, res) => {
        try {
            const projects = await Project.findAll();
            res.json({
                message: "Projects retrieved successfully",
                data: projects
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching projects",
                error: error.message
            });
        }
    },

    // Get a single project by ID
    getProjectById: async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findByPk(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }
            res.json({
                message: "Project retrieved successfully",
                data: project
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching project",
                error: error.message
            });
        }
    },

    // Delete a project
    deleteProject: async (req, res) => {
        try {
            const { id } = req.params;
            const project = await Project.findByPk(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            // Delete image from file system
            if (project.imagePath) {
                deleteFile(project.imagePath);
            }

            await project.destroy();
            res.json({
                message: "Project deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Error deleting project",
                error: error.message
            });
        }
    }
};
