const express = require("express");
const next = require("next");
const geminiAiRoutes = require("./routes/geminiAiRoutes");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  // Add your custom route here
  server.get("/health", (req, res) => {
    res.json({ message: "Server is running!!", success: true });
  });

  server.use("/ai", geminiAiRoutes);

  // Handle all other requests with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
