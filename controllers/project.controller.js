const { Project } = require('../models');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer for local file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads'); // Ensure this directory exists and is writable
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

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
            let imageId = null;
    
            if (file) {
                // Handle file upload
                const uploadResponse = await imageKit.upload({
                    file: file.buffer,
                    fileName: file.originalname
                });
                imageId = uploadResponse.fileId;
            }
    
            const newProject = await Project.create({
                name,
                description,
                link_project,
                imageId
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
    },

    // Update an existing project
    updateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, link_project } = req.body;
            const file = req.file;
            let newImageId = null;

            const project = await Project.findByPk(id);
            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            if (file) {
                // Delete old image
                if (project.imageId) {
                    await deleteImage(project.imageId);
                }

                // Upload new image to ImageKit
                const uploadResponse = await imageKit.upload({
                    file: file.buffer,
                    fileName: file.originalname
                });
                newImageId = uploadResponse.fileId;
            }

            await project.update({ 
                name, 
                description, 
                imageId: newImageId || project.imageId,
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

            // Delete image from ImageKit
            if (project.imageId) {
                await deleteImage(project.imageId);
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
