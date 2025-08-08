"use client";
import { Dict, ResponseTour } from "@/types";
import classes from "./BookingInfo.module.css";
import PrimaryBtn from "../ui/PrimaryBtn";
import { useState } from "react";
import { createBooking } from "@/api";
import { Locale } from "@/i18n-config";
import Link from "next/link";
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
  id,
  lang,
  setShowModal,
}: {
  date: string;
  adult: string;
  child: string | null;
  currentExcursion: ResponseTour;
  dict: Dict;
  email: string;
  phone: string | null;
  telegram: string | null;
  whatsupp: string | null;
  name: string;
  id: string;
  lang: Locale;
  setShowModal: (value: boolean) => void;
}) {
  lang;
  const price =
    Number(currentExcursion.price) * Number(adult) +
    Number(child) * Number(currentExcursion.child_price);
  const [isloading, setLoading] = useState(false);
  const book = async () => {
    setLoading(true);
    try {
      await createBooking({
        tourId: id,
        date: date,
        name: name,
        phone: phone ? phone : null,
        email: email,
        adultsCount: Number(adult),
        childrenCount: child ? Number(child) : 0,
        whatsapp: whatsupp ? whatsupp : null,
        telegram: telegram ? telegram : null,
        isGroup: currentExcursion.type == "private",
      });

      setShowModal(true);
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <p className={classes.label}>{dict["departureCity"]}:</p>
        <p className={classes.value}>
          {
            //@ts-expect-error aaa
            dict[currentExcursion.departure_city]
          }
        </p>
      </div>
      <div className={classes.list}>
        <p className={classes.label}>{dict["departurePlace"]}:</p>
        {currentExcursion.departure_landmark == "fromHotel" ? (
          dict["fromHotel"]
        ) : (
          <Link
            href={`https://www.google.com/maps?q=${
              currentExcursion.departure_lat +
              "," +
              currentExcursion.departure_lng
            }`}
            target="_blank"
            className={`${classes.value} ${classes.link}`}
          >
            {currentExcursion.departure_landmark}
          </Link>
        )}
      </div>
      <div className={classes.list}>
        <p className={classes.label}>{dict["departureTime"]}:</p>
        <p className={classes.value}>{currentExcursion.departure_time}</p>
      </div>
      {currentExcursion.type === "group" ? (
        <div className={classes.list}>
          <p className={classes.label}>{dict["person"]}:</p>
          <p className={classes.value}>
            {adult ? adult : 0} {dict["adult"]}
            {child && child != "0" ? ", " + child : ""}{" "}
            {child && child != "0" ? dict["child"] : ""}
          </p>
        </div>
      ) : (
        <>
          <div className={classes.list}>
            <p className={classes.label}>max {dict["person"]}:</p>
            <p className={classes.value}>{currentExcursion.max_persons}</p>
          </div>
        </>
      )}
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
        {/* <div className={classes.cards}>
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
        </div> */}
        {/* <div className={classes.bookPrice}>
          <p>
            {dict["booking.booking"]}: {price} USD
          </p>
        </div> */}
      </div>
      <div style={{ height: 20 }} />
      <p className={classes.freeBooking}>{dict["free_booking"]}</p>
      <p className={classes.freeBooking2}>{dict["free_booking2"]}</p>
      <PrimaryBtn loading={isloading} text={dict["book"]} onClick={book} />
    </div>
  );
}

export default BookingInfo;
