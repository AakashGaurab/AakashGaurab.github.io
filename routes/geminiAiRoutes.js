const express = require("express");
const runConversation = require("../controller/geminiResponse");

const app = express();

app.use(express.json());


app.get("/generateResponse", runConversation);

module.exports = geminiAiRoutes;
