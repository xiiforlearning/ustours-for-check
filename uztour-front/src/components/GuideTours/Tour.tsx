import { ResponseTour } from "@/types";
import classes from "./GuideTours.module.css";
import { useEffect, useState } from "react";
import DateAdd from "../DateAdd";
import { DateRange } from "react-day-picker";
import PrimaryBtn from "../ui/PrimaryBtn";
import moment from "moment";
import { createTour } from "@/api";

function Tour({
  item,
  index,
  editTour,
  deleteTour,
}: {
  item: ResponseTour;
  index: number;
  editTour: (id: string) => void;
  deleteTour: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<
    {
      quantity: string;
      dateRange?: DateRange;
      avilable_slots?: number;
    }[]
  >([]);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const days = item.availability.map((i) => {
      const [day, month, year] = i.date.split(".");
      const startDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(0, 0, 0, 0);
      const durationValue = Number(item.duration);
      if (item.duration_unit === "days") {
        endDate.setDate(startDate.getDate() + durationValue);
      }

      return {
        quantity: i.available_slots,
        avilable_slots: Number(i.available_slots),
        dateRange: {
          from: startDate,
          to: endDate,
        },
      };
    });
    setDays(days);
  };

  const save = async () => {
    if (loading) return;
    setLoading(true);
    const availability = days.map((item) => ({
      date:
        item.dateRange?.from?.getTime() === item.dateRange?.to?.getTime()
          ? moment(item.dateRange?.from).format("DD.MM.YYYY")
          : moment(item.dateRange?.from).format("DD.MM.YYYY") +
            " - " +
            moment(item.dateRange?.to).format("DD.MM.YYYY"),
      total_slots: item.quantity,
      available_slots: item.quantity,
    }));
    try {
      await createTour({
        id: item.id,
        availability,
        active: true,
        programsList: item.days,
        departure_address: item.departure_address,
        departure_landmark: item.departure_landmark,
        departure_lat: Number(item.departure_lat),
        departure_lng: Number(item.departure_lng),
        data: {
          title: item.title,
          poster: item.main_photo,
          gallery: item.photos,
          cities: item.city,
          duration: item.duration + "",
          duration_unit: item.duration_unit,
          type: item.type,
          difficulty: item.difficulty,
          departure_city: item.departure_city,
          departure_time: item.departure_time,
          price: item.price,
          child_price: item.child_price,
          languages: item.languages,
          excluded: item.excluded,
          included: item.included,
          description: item.description,
          address: item.departure_address,
          orientation: item.departure_landmark,
          max_persons: item.max_persons + "",
          whole_price: item.group_price + "",
          selectedCordinates: [
            Number(item.departure_lat),
            Number(item.departure_lng),
          ],
          min_persons: item.min_persons + "",
          category: item?.category,
        },
      });
    } catch (error) {
      error;
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className={classes.item}
        onClick={() => item.status == "active" && setOpen(!open)}
        key={item.id}
      >
        <p className={classes.index}>{index + 1}.</p>
        <p className={classes.title}>{item.title ? item.title : "Пусто"}</p>
        <p className={classes.status}>
          {item.status == "not_complete" && "Не завершена"}
          {item.status == "moderation" && "На модерации"}
        </p>
        <div className={classes.right}>
          {item.status == "not_complete" && (
            <svg
              width="25"
              onClick={() => editTour(item.id)}
              className={classes.iconBtn}
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.0909 7.03859C21.4809 6.64859 21.4809 5.99859 21.0909 5.62859L18.7509 3.28859C18.3809 2.89859 17.7309 2.89859 17.3409 3.28859L15.5009 5.11859L19.2509 8.86859L21.0909 7.03859ZM3.38086 17.2486V20.9986H7.13086L18.1909 9.92859L14.4409 6.17859L3.38086 17.2486Z"
                fill="#328AEE"
              />
            </svg>
          )}
          {item.status == "not_complete" && (
            <svg
              width="25"
              height="24"
              onClick={() => deleteTour(item.id)}
              className={classes.iconBtn}
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3828 4H15.8828L14.8828 3H9.88281L8.88281 4H5.38281V6H19.3828V4ZM6.38281 19C6.38281 19.5304 6.59353 20.0391 6.9686 20.4142C7.34367 20.7893 7.85238 21 8.38281 21H16.3828C16.9132 21 17.422 20.7893 17.797 20.4142C18.1721 20.0391 18.3828 19.5304 18.3828 19V7H6.38281V19Z"
                fill="#EB5757"
              />
            </svg>
          )}
          {item.status == "active" && (
            <svg
              width="10"
              height="15"
              style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
              viewBox="0 0 6 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.726562 7.80724L3.7799 4.75391L0.726562 1.69391L1.66656 0.753906L5.66656 4.75391L1.66656 8.75391L0.726562 7.80724Z"
                fill="black"
              />
            </svg>
          )}
        </div>
      </div>

      {open && (
        <div className={classes.content}>
          <div className={classes.btns}>
            <PrimaryBtn isRed onClick={reset} text="Сбросить" />
            <PrimaryBtn loading={loading} onClick={save} text="Сохранить" />
          </div>
          <div style={{ height: 20 }} />
          <DateAdd
            duration={item.duration_unit == "days" ? item.duration : 1}
            days={days}
            setDays={setDays}
          />
        </div>
      )}
    </div>
  );
}

export default Tour;
