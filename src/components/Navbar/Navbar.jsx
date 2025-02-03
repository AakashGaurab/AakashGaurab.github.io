// ButtonClient.tsx
"use client";

import { navbarOptions, RESUME_LINK, RESUME_NAME } from "@/utils/constants";
import { Name } from "./Name";
import styles from "./navbar.module.scss";
import { fileDownloader } from "@/utils/function";
import Switch from "../Switch/Switch";

export const Navbar = ({ showDropDown, handleShowDropDown }) => {
  const handleResumeClick = () => {
    fileDownloader(RESUME_NAME, RESUME_LINK);
  };

  const handleOptionsClick = (option) => {
    if (option === "Chat with Bot") {
      console.log(window);
      if (window?.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: "show" });
      }
      window.botpress.sendEvent({ type: "show" });
      window.botpress.sendMessage("Hello");
      return;
    }
    console.log(option);
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.portfolioText}>Portfolio</div>
      <Name />
      <div className={styles.optionsContainer} id={styles.largeScreenNavbar}>
        {navbarOptions.map((options, id) => {
          return (
            <div
              key={id}
              onClick={() => {
                handleOptionsClick(options);
              }}
            >
              {options}
            </div>
          );
        })}
      </div>
      <div
        onClick={handleResumeClick}
        role="button"
        tabIndex="0"
        className={styles.resumeButton}
        id={styles.largeScreenNavbar}
      >
        Resume
      </div>

      <div id={styles.smallScreenNavbar} role="button" tabIndex="0">
        <Switch
          showDropDown={showDropDown}
          handleShowDropDown={handleShowDropDown}
        />
      </div>
    </div>
  );
};
