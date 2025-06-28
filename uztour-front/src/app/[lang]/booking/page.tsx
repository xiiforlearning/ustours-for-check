"use client";
import { Suspense } from "react";
import classes from "./booking.module.css";
import { useSearchParams } from "next/navigation";
import { excursions } from "@/consts";
import Link from "next/link";
import BookingTourInfo from "@/components/BookingTourInfo";
import BookingInfo from "@/components/BookingInfo";

function Booking() {
  const searchParams = useSearchParams();
  const excursion_id = searchParams.get("excursion_id");
  const date = searchParams.get("date");
  const adult = searchParams.get("adult");
  const child = searchParams.get("child");
  if (!excursion_id) {
    return null;
  }
  const currentExcursion = excursions.find(
    (item) => item.id == Number(excursion_id)
  );
  if (!currentExcursion) {
    return null;
  }

  return (
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
        <Link href="/tours" className={classes.headerText}>
          Экскурсии
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
        <Link href={"/tours/" + excursion_id} className={classes.headerText}>
          {currentExcursion.name}
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
        <p>Бронирование</p>
      </div>
      <Link href={"/tours/" + excursion_id} className={classes.back}>
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
        <p className={classes.backText}>Назад</p>
      </Link>
      <h2 className={classes.title}>Детали бронирования</h2>
      <div className={classes.content}>
        <BookingTourInfo currentExcursion={currentExcursion} />
        <BookingInfo
          currentExcursion={currentExcursion}
          date={date}
          adult={adult}
          child={child}
        />
      </div>
    </div>
  );
}
function Page() {
  return (
    <Suspense>
      <Booking />
    </Suspense>
  );
}

export default Page;
