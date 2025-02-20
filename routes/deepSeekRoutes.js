const express = require("express");
const runConversation = require("../controller/deepSeekResponse");

const deepSeekRoute = express.Router();

deepSeekRoute.get("/generateResponse", runConversation);

module.exports = deepSeekRoute;
