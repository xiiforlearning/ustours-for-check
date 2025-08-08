"use client";
import classes from "./booking.module.css";
import { Dict, ResponseTour } from "@/types";
import Link from "next/link";
import BookingTourInfo from "../BookingTourInfo";
import BookingInfo from "../BookingInfo";
import { Locale } from "@/i18n-config";
import PrimaryBtn from "../ui/PrimaryBtn";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Booking({
  dict,
  lang,
  currentExcursion,
  date,
  adult,
  child,
  email,
  phone,
  telegram,
  name,
  whatsupp,
}: {
  dict: Dict;
  lang: Locale;
  currentExcursion: ResponseTour;
  date: string;
  adult: string;
  child: string;
  email: string;
  phone: string;
  telegram: string;
  name: string;
  whatsupp: string;
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && (
        <div className={classes.background}>
          <div className={classes.modal}>
            <svg
              width="40"
              height="41"
              viewBox="0 0 40 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect y="0.5" width="40" height="40" rx="20" fill="#1BB747" />
              <path
                d="M26.6668 15.5L17.5002 24.6667L13.3335 20.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className={classes.successTitle}>{dict["bookingSuccess"]}</h3>
            <p className={classes.detail}>{dict["bookingSuccessDetail"]}</p>
            <PrimaryBtn
              onClick={() => {
                router.replace("/" + lang);
              }}
              text={dict["goToMainPage"]}
            />
          </div>
        </div>
      )}
      <div className={classes.wrapper}>
        <div className={classes.container}>
          <div className={classes.header}>
            <Link href={"/" + lang + "/"} className={classes.headerText}>
              {dict.main}
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
            <Link href={"/" + lang + "/tours"} className={classes.headerText}>
              {dict["header.excursions"]}
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
            <Link
              href={"/" + lang + "/tours/" + currentExcursion?.id}
              className={classes.headerText}
            >
              {currentExcursion?.title}
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
            <p>{dict["booking.booking"]}</p>
          </div>
          <Link
            href={"/" + lang + "/tours/" + currentExcursion?.id}
            className={classes.back}
          >
            <svg
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.63223 10.8625L6.76973 8L9.63223 5.13125L8.75098 4.25L5.00098 8L8.75098 11.75L9.63223 10.8625Z"
                fill="#242D3F"
              />
            </svg>
            <p className={classes.backText}>{dict["booking.back"]}</p>
          </Link>
          <h2 className={classes.title}>{dict["booking.details"]}</h2>
          <div className={classes.content}>
            {currentExcursion && (
              <BookingTourInfo
                dict={dict}
                currentExcursion={currentExcursion}
              />
            )}
            {currentExcursion && (
              <BookingInfo
                currentExcursion={currentExcursion}
                date={date}
                adult={adult}
                name={name}
                setShowModal={setShowModal}
                email={email}
                phone={phone}
                telegram={telegram}
                whatsupp={whatsupp}
                child={child}
                dict={dict}
                id={currentExcursion.id}
                lang={lang}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Booking;
