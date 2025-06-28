import MainSearch from "../MainSearch";
import styles from "./Transfer.module.css";
function Transfer() {
  return (
    <div className={styles.imageBack}>
      <div className={styles.overlay}>
        <div>
          <h1 className={styles.title}>
            Узнай Узбекистан по-настоящему вместе с местными гидами
          </h1>
          <h2 className={styles.label}>
            Экскурсии и трансферы — всё в одном месте
          </h2>
          <MainSearch />
        </div>
      </div>
    </div>
  );
}

export default Transfer;
