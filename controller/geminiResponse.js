const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const getPersonalInfoDeclaration = {
  name: "getUserPersonalData",
  description:
    "Retrieve authenticated user's personal information from storage",
  parameters: {
    type: "object",
    properties: {
      dataType: {
        type: "string",
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

const controlLightFunctionDeclaration = {
  name: "controlLight",
  parameters: {
    type: "OBJECT",
    description: "Set the brightness and color temperature of a room light.",
    properties: {
      brightness: {
        type: "NUMBER",
        description:
          "Light level from 0 to 100. Zero is off and 100 is full brightness.",
      },
      colorTemperature: {
        type: "STRING",
        description:
          "Color temperature of the light fixture which can be `daylight`, `cool` or `warm`.",
      },
    },
    required: ["brightness", "colorTemperature"],
  },
};

async function setLightValues(brightness, colorTemp) {
  // This mock API returns the requested lighting values
  return {
    brightness: brightness,
    colorTemperature: colorTemp,
  };
}

async function userData(dataType) {
  let data = {
    Aakash: {
      info: "Aakash Gaurab is a proficient NodeJs backend developer from Ranchi, Jharkhand. He has strong skills in the MERN stack, React, Node.js, MongoDB, and MySQL. Aakash is currently working as a Frontend Developer at Hyperface Technologies. He has worked on several projects, including an e-commerce website clone and a real-time chat",
    },
    personal_information: {
      full_name: "Aakash Gaurab",
      date_of_birth: "2001-01-09",
      profession: "Full Stack Developer / Node.js Developer / MERN Developer",
      industry: "IT",
      location: "Jaipur, Rajasthan",
      years_of_experience: 1.5,
    },
    skills: {
      primary_skills: ["MERN Stack", "React", "Node.js", "MongoDB", "MySQL"],
      secondary_skills: [
        "AI Agent",
        "Payment Gateway Integration",
        "OAuth",
        "GitHub",
        "AWS",
      ],
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
      prompt_engineer: {
        title: "Prompt Engineer",
        issued_by: "Masai School",
      },
    },
    education: {
      degree: "Bachelor of Computer Application",
      institution: "IGNOU",
      graduation_year: "Ongoing",
    },
    contact_social_links: {
      portfolio_website: "https://aakashgaurab.github.io/",
      github: "https://github.com/AakashGaurab",
      linkedin: "https://www.linkedin.com/in/aakash-gaurab-99b11b1a1/",
      email: "aakashgaurav456@gmail.com",
      mobile_number: "7808927193",
    },
    emailId: { email: "aakashgaurav456@gmail.com" },
    phone_number: { phone: "7808927193" },
    availability_preferences: {
      open_to_work: true,
      freelance_availability: true,
      preferred_work_type: "Remote",
    },
    restrictions_privacy: {
      do_not_share: ["Bank details", "Confidential company data"],
      response_guidelines:
        "Answer only portfolio-related queries and politely refuse unrelated ones.",
    },
  };

  return data[dataType];
}

const functions = {
  controlLight: ({ brightness, colorTemperature }) => {
    return setLightValues(brightness, colorTemperature);
  },
  getUserPersonalData: ({ dataType }) => {
    return userData(dataType);
  },
};

const genAI = new GoogleGenerativeAI(
  `${process.env.NEXT_PUBLIC_MY_SECRET_API_KEY}`
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: {
    role: "system",
    parts: [
      {
        text: `You are an AI assistant attached to a Aakash's portfolio. Your primary responsibility is to provide accurate and relevant information about the person based on their portfolio details.Answer questions only related to the person's portfolio information (e.g., background, skills, experience, projects, achievements, contact_social_links.).Politely refuse to answer any unrelated queries (e.g., general knowledge, news,).Never share bank account details . However you can share Email and Mobile number. 
        Your responses must follow these rules:
        1. Only provide information about the user's schedule, progress, grades, or learning goals
        2. Politely decline to answer any other questions
        3. Never discuss general knowledge, current events, or other topics
        4. Redirect conversations back to the user's personal learning journey
        5. Maintain a professional, educational tone at all times`,
      },
    ],
  },
  tools: {
    functionDeclarations: [getPersonalInfoDeclaration],
  },
  generationConfig: {
    maxOutputTokens: 75,
  },
});

async function runConversation(params) {
  console.log("Running conversation");

  try {
    const chat = model.startChat();
    const prompt = params?.message || "Hello";

    // Send the message to the model.
    const result = await chat.sendMessage(prompt);

    // For simplicity, this uses the first function call found.
    const call = result?.response?.functionCalls();

    if (call) {
      // Call the executable function named in the function call
      // with the arguments specified in the function call and
      // let it call the hypothetical API.

      const apiResponse = await Promise.all(
        call.map((c) => functions[c.name](c.args))
      ); // return array of responses

      // Send the API response back to the model so it can generate
      // a text response that can be displayed to the user.

      let secondResponse = apiResponse.map((response, index) => {
        // doing this because the function expects an array of objects
        return {
          functionResponse: {
            name: "getUserPersonalData",
            response: response,
          },
        };
      });
      const result2 = await chat.sendMessage(secondResponse);

      // Log the text response.
      console.log("Response generated and sent.");
      return { message: result2.response.text(), status: 200 };
    } else {
      console.log("No function calls found in the response.");
      return {
        message: result?.response?.text() || "No response.",
        status: 200,
      };
    }
  } catch (error) {
    console.log("Error generating response", error);
    return { error: "Some error occured.", status: 500 };
  }
}

module.exports = runConversation;
