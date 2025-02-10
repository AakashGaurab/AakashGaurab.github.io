import styles from "./bubbleLoader.module.scss";

export const BubbleLoader = () => {
  return (
    <section className={styles.dotsContainer}>
      <div className={styles.dot}> </div>
      <div className={styles.dot}> </div>
      <div className={styles.dot}> </div>
      <div className={styles.dot}> </div>
      <div className={styles.dot}> </div>
    </section>
  );
};
