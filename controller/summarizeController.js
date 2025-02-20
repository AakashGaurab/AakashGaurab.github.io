const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_MY_SECRET_API_KEY);

const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

const getSummary = async (url) => {
  try {
    const pdfResp = await fetch(url).then((response) => response.arrayBuffer());

    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(pdfResp).toString("base64"),
          mimeType: "application/pdf",
        },
      },
      "Summarize this document",
    ]);
    return result?.response.text();
  } catch (error) {
    return error;
  }
};

const summarizeLoacalPdf = async () => {
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(
            fs.readFileSync("./public/Aakash-Gaurab_Resume.pdf")
          ).toString("base64"),
          mimeType: "application/pdf",
        },
      },
      "Summarize this document",
    ]);
    return result?.response.text();
  } catch (error) {
    return error;
  }
};

async function summarizeController(req, res) {
  try {
    if (req?.query?.url === undefined) {
      res.status(400).json({ message: "Url is required" });
      return;
    }
    // const summary = await getSummary(req?.query?.url);
    const summary = await summarizeLoacalPdf();
    console.log(summary);
    res.status(200).json(`Summary generated ${JSON.stringify(summary)}`);
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
}

module.exports = summarizeController;
