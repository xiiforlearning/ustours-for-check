"use client";
import classes from "./booking.module.css";
import { excursions } from "@/consts";
import { Dict, ResponseTour } from "@/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BookingTourInfo from "../BookingTourInfo";
import BookingInfo from "../BookingInfo";
import { Locale } from "@/i18n-config";
import useStore from "@/store/useStore";
import { useEffect, useState } from "react";
import { getExactTours } from "@/api";

function Booking({ dict, lang }: { dict: Dict; lang: Locale }) {
  const isProduction = useStore((state) => state.isProduction);
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const adult = searchParams.get("adult");
  const child = searchParams.get("child");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const telegram = searchParams.get("telegram");
  const name = searchParams.get("name");
  const whatsupp = searchParams.get("whatsupp");
  const id = searchParams.get("excursion_id");
  const [currentExcursion, setExcursion] = useState<ResponseTour>();

  useEffect(() => {
    if (isProduction) {
      const fetchData = async () => {
        if (!id) return;
        const res = await getExactTours({ id: id });
        setExcursion(res);
      };
      fetchData();
    } else {
      const excursion = excursions.find((excursion) => excursion.id === id);
      if (excursion) {
        setExcursion(excursion);
      }
    }
  }, [isProduction, id]);

  return (
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
            <BookingTourInfo dict={dict} currentExcursion={currentExcursion} />
          )}
          {currentExcursion && (
            <BookingInfo
              currentExcursion={currentExcursion}
              date={date}
              adult={adult}
              name={name}
              email={email}
              phone={phone}
              telegram={telegram}
              whatsupp={whatsupp}
              child={child}
              dict={dict}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Booking;
