const express = require("express");
const runConversation = require("../controller/geminiResponse");

const geminiAiRoutes = express.Router();

geminiAiRoutes.get("/generateResponse", (req, res) => {
  res.json({ message: "Hello from Gemini AI" });
});

module.exports = geminiAiRoutes;
