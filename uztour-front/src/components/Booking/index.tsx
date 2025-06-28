"use client";
import { useState } from "react";
import Select from "../ui/Select";
import classes from "./Booking.module.css";
import Counter from "../Counter";
import PrimaryBtn from "../ui/PrimaryBtn";
import { ExcursionType } from "@/types";
import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
function Booking({ currentExcursion }: { currentExcursion: ExcursionType }) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [date, setDate] = useState("26-29 июля");
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);

  const handleClick = () => {
    if (user) {
      router.push(
        "/booking?excursion_id=" +
          currentExcursion.id +
          "&date=" +
          date +
          "&adult=" +
          adult +
          "&child=" +
          child
      );
    } else {
      router.push(
        "?login=true&excursion_id=" +
          currentExcursion.id +
          "&date=" +
          date +
          "&adult=" +
          adult +
          "&child=" +
          child
      );
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <Select
          value={date}
          setValue={setDate}
          label="Выберите даты"
          options={["30-31 июля", "3-6 августа", "7-10 августа"]}
        />
        <div style={{ height: 12 }} />
        <Counter
          value={adult}
          setValue={(value: number) => {
            value < 1 ? setAdult(1) : setAdult(value);
          }}
          placeholder="Взрослый"
          label="Количество"
        />
        <div style={{ height: 12 }} />
        <Counter
          value={child}
          setValue={(value: number) => {
            value < 0 ? setChild(0) : setChild(value);
          }}
          placeholder="Ребенок (до 139см)"
        />
      </div>
      <div className={classes.bottom}>
        <p className={classes.price}>
          Итого: <span>{currentExcursion.price * (adult + child)} USD</span>
        </p>
        <div style={{ height: 12 }} />
        <PrimaryBtn onClick={handleClick} text="Забронировать" />
      </div>
    </div>
  );
}

export default Booking;
