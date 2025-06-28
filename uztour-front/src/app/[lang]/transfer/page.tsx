import Link from "next/link";
import classes from "./transfer.module.css";
import FilterTransfer from "@/components/FilterTransfer";
import TransportList from "@/components/TransportList";
function Transfer() {
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.header}>
          <Link href="/" className={classes.headerText}>
            Главная
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.72656 11.0533L8.7799 8L5.72656 4.94L6.66656 4L10.6666 8L6.66656 12L5.72656 11.0533Z"
              fill="#242D3F"
            />
          </svg>
          <p className={classes.headerTitle}>Каталог трансфера</p>
        </div>
        <h2 className={classes.title}>Выберите транспорт для трансфера</h2>
        <p className={classes.desc}>
          Встречаем, помогаем с багажом и доставляем точно в срок!
        </p>
        <FilterTransfer />
        <TransportList />
      </div>
    </div>
  );
}

export default Transfer;
