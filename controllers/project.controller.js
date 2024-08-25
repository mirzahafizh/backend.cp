const { Project } = require('../models');
const ImageKit = require('imagekit');

// Initialize ImageKit with your credentials
const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Utility function to delete image from ImageKit
const deleteImage = async (imageId) => {
    try {
        await imageKit.deleteFile(imageId);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

module.exports = {
    // Create a new project
    createProject: async (req, res) => {
        try {
            const { name, description, link_project } = req.body;
            const file = req.file;
            let imageId = null;

            if (file) {
                // Upload image to ImageKit
                const uploadResponse = await imageKit.upload({
                    file: file.buffer,
                    fileName: file.originalname
                });
                imageId = uploadResponse.fileId;
            }

            const newProject = await Project.create({ name, description, imageId, link_project });
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
