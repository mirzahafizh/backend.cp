const express = require('express');
const route = express.Router();
const { createTeamMember, getTeamMemberById, updateTeamMember, deleteTeamMember,getAllTeamMembers } = require('../controllers/team.controller');
const { authenticateToken } = require('../middleware/authenticateToken');
const upload = require('../middleware/uploads'); // Middleware for handling file uploads

// GET all projects
route.get("/", getAllTeamMembers);

// GET a single project by ID
route.get("/:id", getTeamMemberById);

// POST request to create a new project (authentication required)
route.post("/", authenticateToken, upload.single('image'), createTeamMember);

// PUT request to update an existing project (authentication required)
route.put("/:id", authenticateToken, upload.single('image'), updateTeamMember);

// DELETE request to delete a project by ID (authentication required)
route.delete("/:id", authenticateToken, deleteTeamMember);

module.exports = route;
