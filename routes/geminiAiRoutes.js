const express = require("express");
const runConversation = require("../controller/geminiResponse");

const geminiAiRoutes = express.Router();

geminiAiRoutes.post("/generateResponse", runConversation);

module.exports = geminiAiRoutes;
