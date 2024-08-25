const express = require('express');
const route = express.Router();
const userRoute = require('./user.route');
const projectRoute = require('./project.route');
const teamRoute = require('./team.route');
const contactRoute = require('./contact.route'); // Import the contact route
const imagekitRoutes = require('./routes/imagekit.route');


app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); /
route.get("/", (req, res) => {
    res.json("success");
});

route.use("/users", userRoute);
route.use('/projects', projectRoute);
route.use('/teams', teamRoute);
route.use('/contact', contactRoute); // Add the contact route here
app.use('/imagekit', imagekitRoutes);
module.exports = route;
