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
  const [adult, setAdult] = useState(2);
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
          "/tours/" +
          currentExcursion.id +
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

  const options = currentExcursion.availability.map((item) => ({
    label: item.date.split(" - ")[0],
    value: item.date,
  }));

  // useEffect(() => {
  //   if (currentExcursion.type != "private") {
  //     const selectedDate = currentExcursion.availability.find(
  //       (item) => item.date === date
  //     );
  //     if (selectedDate?.available_slots != selectedDate?.total_slots) {
  //       setAdult(1);
  //     }
  //   }
  // }, [currentExcursion.availability, date]);

  const onChange = (
    newValue: OnChangeValue<{ value: string; label: string }, false>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    actionMeta;
    if (newValue?.value) {
      const selectedDate = currentExcursion.availability.find(
        (item) => item.date === newValue.value
      );

      if (Number(selectedDate?.available_slots) < adult + child) {
        setAdult(Number(selectedDate?.available_slots));
        setChild(0);
      }
      setDate(newValue?.value);
      return;
    }
  };

  const changeAdult = (value: number) => {
    if (date) {
      const selectedDate = currentExcursion.availability.find(
        (item) => item.date === date
      );

      const allSlotsAvailable =
        selectedDate?.available_slots === selectedDate?.total_slots;
      if (allSlotsAvailable && value < 2) {
        setAdult(2);
        return;
      } else if (!allSlotsAvailable && value < 1) {
        setAdult(1);
        return;
      }

      if (Number(selectedDate?.available_slots) >= value + child) {
        setAdult(value);
      } else {
        setAdult(
          Math.max(
            Number(selectedDate?.available_slots) - child,
            allSlotsAvailable ? 2 : 1
          )
        );
      }
    } else {
      if (value < 2) {
        setAdult(2);
        return;
      }
      setAdult(value);
    }
  };

  const changeChild = (value: number) => {
    if (value < 1) {
      setChild(0);
      return;
    }
    if (date) {
      const selectedDate = currentExcursion.availability.find(
        (item) => item.date === date
      );
      if (Number(selectedDate?.available_slots) >= value + adult) {
        setChild(value);
      } else {
        setChild(0);
      }
    } else {
      setChild(value);
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
        {currentExcursion.type != "private" && (
          <>
            <div style={{ height: 12 }} />
            <Counter
              value={adult}
              setValue={changeAdult}
              placeholder={dict["adult"]}
              label={dict["quantity"]}
            />
            <div style={{ height: 12 }} />
            <Counter
              value={child}
              setValue={changeChild}
              placeholder={
                dict["child"] + "(" + dict["from"] + "139" + dict["cm"] + ")"
              }
            />
          </>
        )}
      </div>
      <div className={classes.bottom}>
        {currentExcursion.type != "private" && (
          <p className={classes.price}>
            {dict["so"]}:{" "}
            <span>
              {Number(currentExcursion.price) * adult +
                child * Number(currentExcursion.child_price)}{" "}
              USD
            </span>
          </p>
        )}
        {currentExcursion.type == "private" && (
          <p className={classes.price}>
            {dict["so"]}:{" "}
            <span>{Number(currentExcursion.group_price)} USD</span>
          </p>
        )}
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
