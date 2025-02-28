import { useState } from "react";
import styles from "./bot.module.scss";
import { ChatArea } from "./chatArea";
import Image from "next/image";
import robotLogo from "../../../public/assets/png/robot.png";

export const Bot = () => {
  const [isChatAreaVisible, setIsChatAreaVisible] = useState(false);

  const handleChatAreaVisibility = () => {
    setIsChatAreaVisible(!isChatAreaVisible);
  };
  return isChatAreaVisible ? (
    <div className={styles.container}>
      
      <ChatArea handleCloseChatArea={handleChatAreaVisibility} />
    </div>
  ) : (
    <div onClick={handleChatAreaVisibility} className={styles.container2}>
      {" "}
      <Image
        src={robotLogo}
        alt="Chat Here."
        width={125}
        height={125}
        className={styles.robotLogo}
      />{" "}
    </div>
  );
};
