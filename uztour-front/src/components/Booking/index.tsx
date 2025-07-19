"use client";
import { useState } from "react";
import classes from "./Booking.module.css";
import Counter from "../Counter";
import PrimaryBtn from "../ui/PrimaryBtn";
import { Dict, ResponseTour } from "@/types";
import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import Select, { ActionMeta, OnChangeValue } from "react-select";

function Booking({
  currentExcursion,
  dict,
  lang,
}: {
  currentExcursion: ResponseTour;
  dict: Dict;
  lang: Locale;
}) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [date, setDate] = useState<string>();
  const [adult, setAdult] = useState(1);
  const [child, setChild] = useState(0);

  const handleClick = () => {
    if (!date) return;
    if (user) {
      router.push(
        "/" +
          lang +
          "/booking?excursion_id=" +
          currentExcursion.id +
          "&date=" +
          date +
          "&adult=" +
          adult +
          "&child=" +
          child +
          "&confirm-modal=true"
      );
    } else {
      router.push(
        "/" +
          lang +
          "/booking?login=true&excursion_id=" +
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

  const options = currentExcursion.availability.map((item) => ({
    label: item.date.split(" - ")[0],
    value: item.date,
  }));

  const onChange = (
    newValue: OnChangeValue<{ value: string; label: string }, false>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    if (newValue?.value) {
      setDate(newValue?.value);
      return;
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <Select
          value={
            date ? { value: date.split(" - ")[0], label: date } : undefined
          }
          onChange={onChange}
          placeholder={dict["selectDate"]}
          options={options}
        />
        <div style={{ height: 12 }} />
        <Counter
          value={adult}
          setValue={(value: number) => {
            value < 1 ? setAdult(1) : setAdult(value);
          }}
          placeholder={dict["adult"]}
          label={dict["quantity"]}
        />
        <div style={{ height: 12 }} />
        <Counter
          value={child}
          setValue={(value: number) => {
            value < 0 ? setChild(0) : setChild(value);
          }}
          placeholder={
            dict["child"] + "(" + dict["from"] + "139" + dict["cm"] + ")"
          }
        />
      </div>
      <div className={classes.bottom}>
        <p className={classes.price}>
          {dict["so"]}:{" "}
          <span>
            {Number(currentExcursion.price) * adult +
              child * Number(currentExcursion.child_price)}{" "}
            USD
          </span>
        </p>
        <div style={{ height: 12 }} />
        <PrimaryBtn
          disabled={!date}
          onClick={handleClick}
          text={dict["book"]}
        />
      </div>
    </div>
  );
}

export default Booking;
