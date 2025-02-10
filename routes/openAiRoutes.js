const express = require("express");
const runConversation = require("../controller/generateReponse");

const openAiRoutes = express.Router();

openAiRoutes.get("/generateResponse", runConversation);

module.exports = openAiRoutes;
