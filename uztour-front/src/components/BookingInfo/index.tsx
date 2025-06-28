import { ExcursionType } from "@/types";
import classes from "./BookingInfo.module.css";
import Image from "next/image";
import PrimaryBtn from "../ui/PrimaryBtn";
function BookingInfo({
  date,
  adult,
  child,
  currentExcursion,
}: {
  date: string | null;
  adult: string | null;
  child: string | null;
  currentExcursion: ExcursionType;
}) {
  const price = currentExcursion.price * (Number(adult) + Number(child));
  return (
    <div className={classes.container}>
      <div className={classes.listOrdinary}>
        <p className={classes.label}>Имя:</p>
        <p className={classes.value}>Ясин Ёкубов</p>
      </div>
      <div style={{ height: 14 }} />
      <div className={classes.list}>
        <p className={classes.label}>Даты экскурсии:</p>
        <p className={classes.value}>{date}</p>
      </div>
      <div className={classes.list}>
        <p className={classes.label}>Место отправки:</p>
        <p className={classes.value}>Hilton Hotel, ориентир: м. Бадамзар</p>
      </div>
      <div className={classes.list}>
        <p className={classes.label}>Время отправки:</p>
        <p className={classes.value}>8:00 AM</p>
      </div>
      <div className={classes.list}>
        <p className={classes.label}>Персон:</p>
        <p className={classes.value}>
          {adult ? adult : 0} взрослых, {child ? child : 0} детей
        </p>
      </div>
      <div
        style={{ borderBottom: "1px solid #DDDDDD", paddingBottom: 10 }}
        className={classes.list}
      >
        <p className={classes.label}>Контакты:</p>
        <div className={classes.contacts}>
          <p className={classes.value}>yasinyokubov@gmail.com</p>
          <p className={classes.value}>+998 (97) 888-87-46</p>
        </div>
      </div>
      <div className={classes.priceContent}>
        <p className={classes.priceLabel}>Итоговая цена:</p>
        <p className={classes.price}>{price} USD</p>
      </div>
      <div className={classes.cardContent}>
        <div className={classes.cards}>
          <div className={classes.card}>
            <Image
              width={23.55}
              height={11.45}
              src="/images/mastercard.svg"
              alt="mastercard"
            />
          </div>
          <div className={classes.card}>
            <Image width={33} height={10} src="/images/visa.svg" alt="visa" />
          </div>
        </div>
        <div className={classes.bookPrice}>
          <p>Бронирование: {price} USD</p>
        </div>
      </div>
      <div style={{ height: 20 }} />
      <PrimaryBtn text="Оплатить бронирование" onClick={() => {}} />
    </div>
  );
}

export default BookingInfo;
