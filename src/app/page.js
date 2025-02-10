"use client";

import { Navbar } from "@/components/Navbar/Navbar";
import styles from "./page.module.css";
import { useState } from "react";
import { navbarOptions } from "@/utils/constants";
import { Intro } from "@/components/Intro/Intro";
import { About } from "@/components/AboutMe/AboutMe";
import Switch from "@/components/Switch/Switch";
import Skills from "@/components/Skills/Skills";
import Contact from "@/components/Contact/Contact";
import { handleOptionsClick } from "@/utils/function";
import { Bot } from "@/components/Bot/bot";

export default function Home() {
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <div className={styles.page}>
      <div
        className={`${styles.dropDownNavbar} ${
          showDropDown ? styles.active : styles.inactive
        }`}
      >
        <div className={styles.switchContainer}>
          <Switch
            showDropDown={showDropDown}
            handleShowDropDown={setShowDropDown}
          />
        </div>
        <div className={styles.dropDownNavbarOptions}>
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
      </div>

      <Navbar
        showDropDown={showDropDown}
        handleShowDropDown={setShowDropDown}
      />
      <Intro />
      <Skills />
      <About />
      <Contact />
      <Bot />
    </div>
  );
}
