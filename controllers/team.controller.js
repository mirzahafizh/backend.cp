const { Team } = require('../models');
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
  // Create a new team member
  createTeamMember: async (req, res) => {
    try {
      const { name, position, linkedin, link_instagram, link_github } = req.body;
      const image = req.file ? req.file.filename : null;

      const newTeamMember = await Team.create({ 
        name, 
        position, 
        linkedin, 
        link_instagram, 
        link_github, 
        image 
      });
      
      res.status(201).json({
        message: "Team member created successfully",
        data: newTeamMember
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating team member",
        error: error.message
      });
    }
  },

  // Update an existing team member
  updateTeamMember: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, position, linkedin, link_instagram, link_github } = req.body;
      const newImage = req.file ? req.file.filename : null;

      const teamMember = await Team.findByPk(id);
      if (!teamMember) {
        return res.status(404).json({
          message: "Team member not found"
        });
      }

      if (newImage) {
        // Delete old image
        deleteImage(teamMember.image);
      }

      await teamMember.update({ 
        name, 
        position, 
        linkedin, 
        link_instagram, 
        link_github, 
        image: newImage || teamMember.image 
      });

      res.json({
        message: "Team member updated successfully",
        data: teamMember
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating team member",
        error: error.message
      });
    }
  },

  // Get all team members
  getAllTeamMembers: async (req, res) => {
    try {
      const teamMembers = await Team.findAll();
      res.json({
        message: "Team members retrieved successfully",
        data: teamMembers
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching team members",
        error: error.message
      });
    }
  },

  // Get a single team member by ID
  getTeamMemberById: async (req, res) => {
    try {
      const { id } = req.params;
      const teamMember = await Team.findByPk(id);
      if (!teamMember) {
        return res.status(404).json({
          message: "Team member not found"
        });
      }
      res.json({
        message: "Team member retrieved successfully",
        data: teamMember
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching team member",
        error: error.message
      });
    }
  },

  // Delete a team member
  deleteTeamMember: async (req, res) => {
    try {
      const { id } = req.params;
      const teamMember = await Team.findByPk(id);
      if (!teamMember) {
        return res.status(404).json({
          message: "Team member not found"
        });
      }

      // Delete image
      deleteImage(teamMember.image);

      await teamMember.destroy();
      res.json({
        message: "Team member deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting team member",
        error: error.message
      });
    }
  }
};
