const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// 1. Tool Declaration
const getPersonalInfoDeclaration = {
  name: "getUserPersonalData",
  description: "Retrieve authenticated user's personal information from storage",
  parameters: {
    type: "OBJECT",
    properties: {
      dataType: {
        type: "STRING",
        description: "The specific category of information to retrieve.",
        enum: [
          "Aakash",
          "emailId",
          "phone_number",
          "personal_information",
          "skills",
          "work_experience",
          "education",
          "certifications_awards",
          "contact_social_links",
          "availability_preferences",
        ],
      },
    },
    required: ["dataType"],
  },
};

// 2. Data Logic
async function userData(dataType) {
  const data = {
    Aakash: {
      info: "Aakash Gaurab is a proficient NodeJs backend developer from Ranchi, Jharkhand. He has strong skills in the MERN stack, React, Node.js, MongoDB, and MySQL.",
    },
    personal_information: {
      full_name: "Aakash Gaurab",
      profession: "Full Stack Developer",
      location: "Jaipur, Rajasthan",
      years_of_experience: 1.5,
    },
    skills: {
      primary_skills: ["MERN Stack", "React", "Node.js", "MongoDB", "MySQL"],
      tech_stack: "MERN",
    },
    work_experience: {
      current_role: {
        title: "Frontend Developer",
        company: "Hyperface Technologies",
        start_date: "2024-01-30",
        status: "Present",
      },
      previous_roles: [
        {
          title: "Computer Technician",
          company: "New Computer Link",
          start_date: "2018-01-10",
          end_date: "2021-08-11",
        },
      ],
    },
    certifications_awards: {
      prompt_engineer: { title: "Prompt Engineer", issued_by: "Masai School" },
    },
    education: {
      degree: "Bachelor of Computer Application",
      institution: "IGNOU",
      graduation_year: "Ongoing",
    },
    contact_social_links: {
      github: "https://github.com/AakashGaurab",
      linkedin: "https://www.linkedin.com/in/aakash-gaurab-99b11b1a1/",
      email: "aakashgaurav456@gmail.com",
      mobile_number: "7808927193",
    },
    emailId: { email: "aakashgaurav456@gmail.com" },
    phone_number: { phone: "7808927193" },
    availability_preferences: {
      open_to_work: true,
      preferred_work_type: "Remote",
    },
  };

  // Fallback if the AI requests a key that doesn't exist perfectly
  return data[dataType] || { error: "Information not found." };
}

// 3. Map Function Names to Actual Functions
const functions = {
  getUserPersonalData: ({ dataType }) => {
    return userData(dataType);
  },
};

// 4. Initialize AI
// NOTE: Ensure your .env file has GOOGLE_API_KEY=AIza...
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_MY_SECRET_API_KEY || "API_KEY");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // Corrected model name
  systemInstruction: {
    role: "system",
    parts: [
      {
        text: `You are an AI assistant for Aakash Gaurab's portfolio.
        
        Your responsibilities:
        1. Answer questions strictly based on Aakash's portfolio (skills, experience, contact info).
        2. If you need specific details, use the 'getUserPersonalData' tool.
        3. Politely refuse to answer general knowledge questions (e.g., "What is the capital of France?").
        4. Never share sensitive banking details (though none are provided in your tools).
        5. You can share his Email and Mobile number if asked.
        6. Maintain a professional and helpful tone.`,
      },
    ],
  },
  tools: [
    {
      functionDeclarations: [getPersonalInfoDeclaration],
    },
  ],
  generationConfig: {
    maxOutputTokens: 200, // Increased slightly for better answers
  },
});

async function runConversation(params) {
  console.log("Running conversation...");

  try {
    const chat = model.startChat();
    const prompt = params?.message || "Hello, who is this?";

    // 1. Send Initial Message
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const functionCalls = response.functionCalls();

    // 2. Check for Function Calls
    if (functionCalls && functionCalls.length > 0) {
      console.log("Function call detected:", functionCalls[0].name);

      // Execute all requested functions
      const apiResponses = await Promise.all(
        functionCalls.map(async (call) => {
          const fn = functions[call.name];
          if (fn) {
            const apiResult = await fn(call.args);
            // Return in the specific format required by Gemini
            return {
              functionResponse: {
                name: call.name, // DYNAMIC NAME (Fixed error here)
                response: apiResult,
              },
            };
          } else {
            console.error(`Function ${call.name} not found`);
            return {
                functionResponse: {
                    name: call.name,
                    response: { error: "Function not found" }
                }
            }
          }
        })
      );

      // 3. Send API Results back to Model
      const result2 = await chat.sendMessage(apiResponses);
      
      console.log("Response generated and sent.");
      return { message: result2.response.text(), status: 200 };
    } else {
      console.log("No function calls found. Returning text.");
      return {
        message: response.text(),
        status: 200,
      };
    }
  } catch (error) {
    console.error("Error generating response:", error);
    return { error: "An error occurred while processing your request.", status: 500 };
  }
}

module.exports = runConversation;