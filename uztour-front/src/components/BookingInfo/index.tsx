import { Dict, ResponseTour } from "@/types";
import classes from "./BookingInfo.module.css";
import Image from "next/image";
import PrimaryBtn from "../ui/PrimaryBtn";
function BookingInfo({
  date,
  adult,
  child,
  currentExcursion,
  dict,
  email,
  phone,
  telegram,
  whatsupp,
  name,
}: {
  date: string | null;
  adult: string | null;
  child: string | null;
  currentExcursion: ResponseTour;
  dict: Dict;
  email: string | null;
  phone: string | null;
  telegram: string | null;
  whatsupp: string | null;
  name: string | null;
}) {
  const price =
    Number(currentExcursion.price) * Number(adult) +
    Number(child) * Number(currentExcursion.child_price);
  return (
    <div className={classes.container}>
      <div className={classes.listOrdinary}>
        <p className={classes.label}>{dict["name"]}:</p>
        {name && <p className={classes.value}>{name}</p>}
      </div>
      <div style={{ height: 14 }} />
      <div className={classes.list}>
        <p className={classes.label}>{dict["dateExcursion"]}:</p>
        <p className={classes.value}>{date}</p>
      </div>
      <div className={classes.list}>
        <p className={classes.label}>{dict["departurePlace"]}:</p>
        <p className={classes.value}>{currentExcursion.departure_city}</p>
      </div>
      <div className={classes.list}>
        <p className={classes.label}>{dict["departureTime"]}:</p>
        <p className={classes.value}>{currentExcursion.departure_time}</p>
      </div>
      <div className={classes.list}>
        <p className={classes.label}>{dict["person"]}:</p>
        <p className={classes.value}>
          {adult ? adult : 0} {dict["adult"]}, {child ? child : 0}{" "}
          {dict["child"]}
        </p>
      </div>
      <div
        style={{ borderBottom: "1px solid #DDDDDD", paddingBottom: 10 }}
        className={classes.list}
      >
        <p className={classes.label}>{dict.contacts}:</p>
        <div className={classes.contacts}>
          {email && <p className={classes.value}>{email}</p>}
          {phone && <p className={classes.value}>+{phone}</p>}
          {telegram && <p className={classes.value}>Telegram: {telegram}</p>}
          {whatsupp && <p className={classes.value}>Whatsapp:{whatsupp}</p>}
        </div>
      </div>
      <div className={classes.priceContent}>
        <p className={classes.priceLabel}>{dict.totalPrice}:</p>
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
          <p>
            {dict["booking.booking"]}: {price} USD
          </p>
        </div>
      </div>
      <div style={{ height: 20 }} />
      <PrimaryBtn text={dict["payBooking"]} onClick={() => {}} />
    </div>
  );
}

export default BookingInfo;
