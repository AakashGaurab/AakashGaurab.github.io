import styles from "./name.module.scss";
export const Name = () => {
  return (
    <div className={styles.name}>
      <div className={styles.nameText}>
        Aakash <span className={styles.title}>Gaurab</span>
      </div>
    </div>
  );
};
