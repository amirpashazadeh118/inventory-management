const express = require("express");
const router = express.Router();
const { queryDb, sql } = require("./db.js");
const { authorizeRoles, authenticateJWT } = require("./userRoutes.js");

module.exports = router;

// controller part


// service part