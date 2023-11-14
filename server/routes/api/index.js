// Initialize express router
const router = require("express").Router();
const path = require("path");
const apiRoutes = require("./api");

// Define API routes
router.use("/api", apiRoutes);

// Define the route for the homepage
router.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = router;
