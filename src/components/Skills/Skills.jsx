"use client";
import React from "react";
import "./Skills.css";
import Github from "./Github";
import GitHubCalendar from "react-github-calendar";
import { skills, otherSkills } from "@/utils/constants";

const ImageAnimate = {
  offscreen: { y: 0, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    viewport: { once: false, amount: 1 },
    transition: { duration: 1 },
  },
};
// console.log("first")
export default function Skills() {
  return (
    <div id="skills">
      <h1 style={{ fontWeight: 500 }}>Skills</h1>
      <div id="skill_section">
        <h2>Web development</h2>
        <div className="skills-card">
          {skills.map((e) => {
            return (
              <div className="skill_box" key={e.name}>
                <img src={`${e.image}`} alt="" className="skills-card-img" />
                <span className="skills-card-name">{e.name}</span>
              </div>
            );
          })}
        </div>
        <h2>Other Skills</h2>
        <div className="skills-card">
          {otherSkills.map((e) => {
            return (
              <div className="skill_box" key={e.name}>
                <img src={`${e.image}`} alt="" className="skills-card-img" />
                <span className="skills-card-name">{e.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <h1 style={{ fontWeight: 500 }}>My Github Activity</h1>
      <div className="githubConatiner">
        {/* <div> */}
        <img
          id="github-streak-stats"
          style={{ maxWidth: "100%" }}
          src="https://github-readme-streak-stats.herokuapp.com?user=AakashGaurab&theme=buefy-dark&hide_border=true&background=191924&border=854CE6&ring=854CE6&currStreakNum=854CE6&sideLabels=854CE6&currStreakLabel=854CE6&stroke=854CE6"
          alt="GitHub Streak"
        />
        <div className="react-activity-calendar">
          <Github />
        </div>
        {/* </div> */}
        <div>
          <a href="https://git.io/streak-stats">
            <img
              id="github-streak-stats"
              style={{ maxWidth: "100%" }}
              src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=AakashGaurab&theme=shades_of_purple"
              alt="GitHub Streak"
            />
          </a>
        </div>

        <div style={{ height: "0px" }}>
          <img
            src="https://github-readme-stats.vercel.app/api/top-langs/?username=AakashGaurab&layout=compact&theme=dark"
            alt=""
            id="github-top-langs"
            style={{ height: "0px" }}
          />
        </div>
        <div style={{ height: "0px" }}>
          <img
            src="https://github-readme-stats.vercel.app/api?username=AakashGaurab&show_icons=true&theme=transparent"
            id="github-stats-card"
            alt=""
            style={{ height: "0px" }}
          />
        </div>
      </div>
    </div>
  );
}
