const express = require("express");

const summarizeController = require("../controller/summarizeController");

const summarizeRoutes = express.Router();

summarizeRoutes.get("/generateResponse", summarizeController);

module.exports = summarizeRoutes;
