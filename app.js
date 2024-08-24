const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
// Use CORS middleware with configuration
app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow credentials (like cookies) if needed
}));


// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Other middleware and route setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import and use routes
const allRoutes = require('./routes');
app.use(allRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
