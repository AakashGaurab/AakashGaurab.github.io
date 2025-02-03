import styles from "./aboutMe.module.scss";
import ProfilePhoto from "../../../public/assets/png/AakashImage.png";
import Image from "next/image";

export const About = () => {
  return (
    <div className={styles.aboutMeContainer}>
      <h2>About Me</h2>
      <div className={styles.aboutmeContainer1}>
      <div className={styles.descriptionContainer}>
        <div className={styles.description1}>
          Hello again! Thanks for scrolling this far! 🤗 Hi I'm Aakash Gaurab
          from <span className={styles.blueText}>Ranchi</span>,{" "}
          <span className={styles.blueText}>Jharkhand</span>
        </div>
        <div className={styles.description2}>
          I am a competent{" "}
          <span className={styles.blueText}>NodeJs backend developer</span>,
          with a strong proficiency in designing and implementing complex
          systems using various technologies. A deep understanding of data
          structures, algorithms which enables me to create{" "}
          <span className={styles.blueText}>efficient</span>,{" "}
          <span>scalable</span>, and
          <span className={styles.blueText}>maintainable</span> code. having a
          passion for constantly improving my skills and taking on new
          challenges. Some of the Skils that I have learned are{" "}
          <span className={styles.blueText}> HTML</span>, 
          <span className={styles.blueText}> CSS</span>,
          <span className={styles.blueText}> Javascript</span>,
          <span className={styles.blueText}> Express</span>,
          <span className={styles.blueText}> MySql</span> and 
          <span className={styles.blueText}> Nodejs</span>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <Image
          width={250}
          height={250}
          src={ProfilePhoto}
          alt="AvatarImage"
          className={styles.AvatarImage}
        />
      </div>
      </div>
      
    </div>
  );
};
