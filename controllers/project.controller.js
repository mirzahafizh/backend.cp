const { Project } = require('../models');
const path = require('path');
const fs = require('fs');

// Utility function to delete image
const deleteImage = (imageName) => {
  const imagePath = path.join(__dirname, '../uploads', imageName);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

module.exports = {
    // Create a new project
    createProject: async (req, res) => {
        try {
            const { name, description, link_project } = req.body;
            const image = req.file ? req.file.filename : null;

            const newProject = await Project.create({ name, description, image, link_project });
            res.status(201).json({
                message: "Project created successfully",
                data: newProject
            });
        } catch (error) {
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
            const newImage = req.file ? req.file.filename : null;

            const project = await Project.findByPk(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (newImage) {
                // Delete old image
                deleteImage(project.image);
            }

            await project.update({ 
                name, 
                description, 
                image: newImage || project.image,
                link_project: link_project || project.link_project // Update link_project
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

            // Delete image
            deleteImage(project.image);

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
