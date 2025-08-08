"use client";
import { useEffect, useState } from "react";
import classes from "./GuideBookings.module.css";
import { getBooking } from "@/api";
import { ResponseTour } from "@/types";
function GuideBookings() {
  const [data, setData] = useState<
    {
      id: string;
      customer: {
        id: string;
        firstName: string;
        lastName: string;
        user: {
          id: string;
          email: string;
        };
      };
      tour: ResponseTour;
      tour_date: string;
      adults_count: number;
      children_count: number;
      total_price: number;
      whatsapp: string;
      telegram: string;
      contact_phone: string;
      contact_email: string;
      confirmed_at: string;
      created_at: string;
      child_price: string;
      adult_price: string;
      contact_fullname: string;
      isGroup: boolean;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const bookings = await getBooking();
      setData(bookings);
      setIsLoading(false);
    };
    fetch();
  }, []);

  function formatDate(date: Date): string {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  }
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {!isLoading && !data.length && <h2>У вас пока нет бронирований</h2>}
        {data.map((item) => (
          <div className={classes.item} key={item.id}>
            <div className={classes.info}>
              <p className={classes.label}>На какое число:</p>
              <p className={classes.value}>{item.tour_date}</p>
            </div>
            <div className={classes.info}>
              <p className={classes.label}>Когда пришло:</p>
              <p className={classes.value}>
                {formatDate(new Date(item.created_at))}
              </p>
            </div>
            <div className={classes.info}>
              <p className={classes.label}>Название тура:</p>
              <p className={classes.value}>{item.tour.title}</p>
            </div>

            {!item.isGroup && (
              <>
                <div className={classes.info}>
                  <p className={classes.label}>Сколько взрослых:</p>
                  <p className={classes.value}>{item.adults_count}</p>
                </div>
                <div className={classes.info}>
                  <p className={classes.label}>Сколько детей:</p>
                  <p className={classes.value}>{item.children_count}</p>
                </div>
                <div className={classes.info}>
                  <p className={classes.label}>Цена для взрослых:</p>
                  <p className={classes.value}>{item.adult_price}</p>
                </div>
                <div className={classes.info}>
                  <p className={classes.label}>Цена для детей:</p>
                  <p className={classes.value}>{item.child_price}</p>
                </div>
              </>
            )}
            <div className={classes.info}>
              <p className={classes.label}>Общая сумма:</p>
              <p className={classes.value}>{item.total_price}</p>
            </div>
            <div className={classes.info}>
              <p className={classes.label}>Имя клиента:</p>
              <p className={classes.value}>{item.contact_fullname}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuideBookings;
