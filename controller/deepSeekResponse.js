const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1", // Your local endpoint
  apiKey: "sk-anykey", // Most local servers ignore this, but some require a dummy key
});

// Define your custom functions
const functions = {
  getCurrentWeather: (location) => {
    // In real use, you'd call a weather API here
    const weatherData = {
      location: location,
      temperature: "22°C",
      conditions: "Sunny",
      unit: "celsius",
    };
    return weatherData;
  },
};

const initialResponseFunction = async (messages) => {
  console.log("Generating initial response");
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-r1:latest",
      messages: messages,
      functions: [
        {
          name: "getCurrentWeather",
          description: "Get the current weather in a given location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
            },
            required: ["location"],
          },
        },
      ],
      function_call: "auto",
    });

    console.log("Iinitial response generated");
    return response;
  } catch (error) {
    console.log("Error generating initial response", error);
    return error;
  }
};

async function runConversation(req, res) {
  // Step 1: Send the user message to OpenAI
  console.log("Running conversation");
  try {
    const messages = [
      {
        role: "user",
        content: req.query?.message || "What's the weather in Birgunj, Nepal?",
      },
    ];

    const initialResponse = await initialResponseFunction(messages);
    const responseMessage = initialResponse?.choices[0]?.message;

    // Step 2: Check if the AI wants to call a function
    console.log(responseMessage);
    if (responseMessage?.function_call) {
      const functionName = responseMessage?.function_call?.name;
      const functionArgs = JSON.parse(
        responseMessage?.function_call?.arguments || "{}"
      );

      // Step 3: Call the function
      const functionResponse = functions[functionName](functionArgs.location);

      // Step 4: Send the function response back to OpenAI
      messages.push(responseMessage); // Add assistant's response
      messages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResponse),
      });

      // Get the final AI response
      const finalResponse = await openai.chat.completions.create({
        model: "deepseek-r1:latest",
        messages: messages,
      });

      console.log("Final response generated");
      res
        .status(200)
        .json({ message: finalResponse.choices[0].message.contents });
    } else {
      console.log(responseMessage.content);
      res.status(400).json({ message: responseMessage.content });
    }
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
}

module.exports = runConversation;
