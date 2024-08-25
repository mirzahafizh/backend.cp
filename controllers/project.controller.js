const { Project } = require('../models');
const ImageKit = require('imagekit');
const path = require('path');
const fs = require('fs');

// Configure ImageKit
const imageKit = new ImageKit({
  publicKey: 'YOUR_PUBLIC_KEY',
  privateKey: 'YOUR_PRIVATE_KEY',
  urlEndpoint: 'YOUR_URL_ENDPOINT'
});

// Utility function to delete image from ImageKit
const deleteImageFromImageKit = async (fileId) => {
  try {
    await imageKit.deleteFile(fileId);
  } catch (error) {
    console.error('Error deleting image from ImageKit:', error);
  }
};

module.exports = {
  // Create a new project
  createProject: async (req, res) => {
    try {
      const { name, description, link_project } = req.body;
      const imageFile = req.file;

      let imageUrl = null;
      if (imageFile) {
        const file = imageFile.buffer; // assuming you are using multer to handle file uploads
        const result = await imageKit.upload({
          file: file,
          fileName: imageFile.originalname,
        });
        imageUrl = result.url;
      }

      const newProject = await Project.create({ name, description, image: imageUrl, link_project });
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
      const newImageFile = req.file;

      const project = await Project.findByPk(id);
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      if (newImageFile) {
        // Delete old image from ImageKit
        await deleteImageFromImageKit(project.image);

        // Upload new image
        const file = newImageFile.buffer;
        const result = await imageKit.upload({
          file: file,
          fileName: newImageFile.originalname,
        });

        project.image = result.url;
      }

      await project.update({ 
        name, 
        description, 
        image: project.image,
        link_project: link_project || project.link_project
      });

      res.json({
        message: "Project updated successfully",
        data: project
      });
    } catch (error) {
      console.error('Error updating project:', error);
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
      console.error('Error fetching projects:', error);
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
      console.error('Error fetching project:', error);
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
      await deleteImageFromImageKit(project.image);

      await project.destroy();
      res.json({
        message: "Project deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({
        message: "Error deleting project",
        error: error.message
      });
    }
  }
};
