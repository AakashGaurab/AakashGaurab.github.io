import styles from "./bot.module.scss";
import CloseImage from "../../../public/assets/svg/close.svg";
import ResetImage from "../../../public/assets/svg/reset.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const ChatArea = ({ handleCloseChatArea }) => {
  const chatAreaRef = useRef(null);

  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hey, This is Aakash's AI. How can I help you?",
      isUser: false,
    },
  ]);
  const [isMessageGenerating, setIsMessageGenerating] = useState(false);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling
      });
    }
  }, [messages]); // Scroll to bottom when messages change

  const generateAIResponse = async () => {
    setIsMessageGenerating(true); // Set loading state
    setChatMessage(""); // Reset the chat message
    try {
      const response = await axios.get("/ai/generateResponse", {
        message: chatMessage,
      });

      if (response?.status === 200) {
        const data = response?.data?.message;

        if (!data) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "Sorry I am facing some error generating response for that.",
              isUser: false,
            },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data, isUser: false },
          ]);
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry I am facing some error generating response for that.",
            isUser: false,
          },
        ]);
        console.log("No response from server");
      }

      setIsMessageGenerating(false);
    } catch (error) {
      console.log(error);
      setIsMessageGenerating(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        text: "Hey, This is Aakash's AI. How can I help you?",
        isUser: false,
      },
    ]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !isMessageGenerating) {
      event.preventDefault(); // Prevents new line
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: chatMessage, isUser: true },
      ]); // Add user message to chat
      generateAIResponse(); // Call the function to generate AI response
    }
  };

  return (
    <div className={styles.chatArea}>
      <div className={styles.chatAreaHeader}>
        <div className={styles.logo}>A</div>
        <div>Aakash's AI</div>
        <div className={styles.chatAreaHeaderIcons}>
          <div onClick={handleResetChat}>
            <Image src={ResetImage} alt="Reset" />
          </div>
          <div onClick={handleCloseChatArea}>
            <Image src={CloseImage} alt="close" />
          </div>
        </div>
      </div>
      <div className={styles.chatAreaBody}></div>
      <div className={styles.chatAreaContainer} ref={chatAreaRef}>
        {" "}
        <li className={styles.startingLogo}>
          <span className={styles.chatAreaLogo}>A</span>
          <div className={styles.startingLogoText}>Aakash's AI</div>
        </li>{" "}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.isUser ? styles.user : styles.bot
            }`}
          >
            <div className={styles.messageContainer2}>
              {!msg?.isUser && <span className={styles.botChatLogo}>A</span>}
              <p
                className={`${styles.textContainer} ${
                  msg?.isUser
                    ? styles.userTextContainer
                    : styles.botTextContainer
                }`}
              >
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.chatAreaFooter}>
        {" "}
        <textarea
          name=""
          id=""
          className={styles.textArea}
          placeholder="Chat with My Bot."
          value={chatMessage}
          style={{ height: "20px" }}
          onChange={(e) => {
            setChatMessage(e?.target?.value);
          }}
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            e.target.style.height = "20px"; // Reset height
            e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
          }}
        ></textarea>{" "}
      </div>
    </div>
  );
};
