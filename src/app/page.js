"use client";

import { Navbar } from "@/components/Navbar/Navbar";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { navbarOptions } from "@/utils/constants";
import { Intro } from "@/components/Intro/Intro";
import { About } from "@/components/AboutMe/AboutMe";
import Switch from "@/components/Switch/Switch";
import Skills from "@/components/Skills/Skills";
import Contact from "@/components/Contact/Contact";
import { handleOptionsClick } from "@/utils/function";
import { Bot } from "@/components/Bot/bot";
import { Shuriken } from "@/components/loader/shurikenLoader/shuriken";

export default function Home() {
  const [showDropDown, setShowDropDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return !isLoading ? (
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
  ) : (
    <div className={styles.pageLoaderContainer}>
      <Shuriken />
      <h3 className={styles.loadingText}> Loading . . .</h3>
    </div>
  );
}
