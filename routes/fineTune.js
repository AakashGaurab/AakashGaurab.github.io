const express = require("express");
const { default: OpenAI } = require("openai");

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1", // Your local endpoint
  apiKey: "sk-anykey", // Most local servers ignore this, but some require a dummy key
});

const fineTuneRoutes = express.Router();

fineTuneRoutes.get("/hey", async (req, res) => {
  console.log(
    await openai.fineTuning.jobs.create({
      training_file: "file-abc123",
      model: "gpt-4o-mini-2024-07-18",
      method: {
        type: "supervised",
        supervised: {
          hyperparameters: { n_epochs: 2 },
        },
      },
    })
  );
  try {
    const fineTune = await openai?.fineTuning?.jobs?.create({
      training_file: "file-abc123",
      model: "deepseek-r1:latest",
      method: {
        type: "supervised",
        supervised: {
          hyperparameters: { n_epochs: 2 },
        },
      },
    });

    console.log(fineTune);

    res.status(200).json({ message: "Fine Tuning Done." });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: error });
  }
});

module.exports = fineTuneRoutes;
