import styles from "./intro.module.scss";
import AvatarImage from "../../../public/assets/jpg/AvatarImage.jpg";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export const Intro = () => {
  return (
    <>
      <div className={styles.introContainer}>
        <div className={styles.introContent}>
          <div className={styles.nameIntroContainer}>
            <h1 className={styles.helloText}>Hello!</h1>
            <span className={styles.nameIntro}>
              I'm Aakash. <span className={styles.wavingHand}>👋</span>
            </span>
          </div>
          <div className={styles.smallDesc}>
            A multidisciplinary developer with a passion for <br /> creating
            engaging, entertaining user experiences. ✨
          </div>
        </div>
        <div className={styles.avatarImageContainer}>
          <Image
            width={100}
            height={100}
            src={AvatarImage}
            alt="AvatarImage"
            className={styles.AvatarImage}
          />
        </div>
      </div>

      <div className={styles.downChevronContainer}>
        <FontAwesomeIcon
          icon={faChevronDown}
          bounce
          style={{ color: "#1569f9" }}
        />
      </div>
    </>
  );
};
