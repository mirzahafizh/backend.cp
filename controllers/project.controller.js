const { Project } = require('../models');
const fs = require('fs');
const path = require('path');

// Define the directory where images will be stored
const imageDirectory = path.join(__dirname, '../uploads');

// Utility function to delete image from local storage
const deleteImage = (imageName) => {
    const imagePath = path.join(imageDirectory, imageName);
    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error deleting image:', err);
        }
    });
};

module.exports = {
    // Create a new project
    createProject: async (req, res) => {
        try {
            const { name, description, link_project } = req.body;
            const file = req.file;
            let imageName = null;

            if (file) {
                // Save file to local storage
                imageName = file.filename;
            }

            const newProject = await Project.create({ name, description, imageName, link_project });
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
    },

    // Update an existing project
    updateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, link_project } = req.body;
            const file = req.file;
            let newImageName = null;

            const project = await Project.findByPk(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (file) {
                // Delete old image if exists
                if (project.imageName) {
                    deleteImage(project.imageName);
                }

                // Save new image to local storage
                newImageName = file.filename;
            }

            await project.update({ 
                name, 
                description, 
                imageName: newImageName || project.imageName,
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

            // Delete image from local storage
            if (project.imageName) {
                deleteImage(project.imageName);
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
