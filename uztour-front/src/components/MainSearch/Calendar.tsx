"use client";
import { Dict } from "@/types";
import classes from "./MainSearch.module.css";
import { Calendar as CalendarComp } from "primereact/calendar";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useRef, useState } from "react";
function Calendar({ dict }: { dict: Dict }) {
  const today = new Date();
  const tomorrow = new Date(today);
  const ref = useRef<CalendarComp | null>(null);
  const wrapper = useRef<HTMLDivElement | null>(null);
  tomorrow.setDate(today.getDate() + 1);
  const [value, setValue] = useState<Date | null>(null);

  const show = () => {
    if (ref.current) {
      ref.current.show();
    }
  };
  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = String(date.getFullYear()); // get last two digits
    return `${day}.${month}.${year}`;
  }

  return (
    <>
      <div onClick={show} className={classes.selectDate}>
        <div ref={wrapper} className={classes.calendarWrapper}>
          <CalendarComp
            value={value}
            onChange={(e) => e.value && setValue && setValue(e.value)}
            minDate={tomorrow}
            ref={ref}
            style={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
            dateFormat={"dd.mm.yy"}
            hourFormat="24"
          />
        </div>
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.50342 12.0829C1.50434 12.8561 1.81193 13.5975 2.35869 14.1442C2.90546 14.691 3.64678 14.9986 4.42002 14.9995H12.5865C13.3598 14.9986 14.1011 14.691 14.6478 14.1442C15.1946 13.5975 15.5022 12.8561 15.5031 12.0829V6.83301H1.50342V12.0829ZM11.4199 9.45795C11.5929 9.45795 11.7621 9.50927 11.906 9.60541C12.0499 9.70156 12.162 9.83821 12.2283 9.99809C12.2945 10.158 12.3118 10.3339 12.278 10.5036C12.2443 10.6734 12.1609 10.8293 12.0386 10.9516C11.9162 11.074 11.7603 11.1573 11.5906 11.1911C11.4208 11.2249 11.2449 11.2075 11.085 11.1413C10.9252 11.0751 10.7885 10.9629 10.6924 10.819C10.5962 10.6752 10.5449 10.506 10.5449 10.3329C10.5449 10.1009 10.6371 9.87832 10.8012 9.71423C10.9653 9.55014 11.1878 9.45795 11.4199 9.45795ZM8.50327 9.45795C8.67633 9.45795 8.84549 9.50927 8.98938 9.60541C9.13327 9.70156 9.24542 9.83821 9.31165 9.99809C9.37787 10.158 9.3952 10.3339 9.36144 10.5036C9.32768 10.6734 9.24434 10.8293 9.12198 10.9516C8.99961 11.074 8.8437 11.1573 8.67397 11.1911C8.50424 11.2249 8.32831 11.2075 8.16843 11.1413C8.00855 11.0751 7.87189 10.9629 7.77575 10.819C7.67961 10.6752 7.62829 10.506 7.62829 10.3329C7.62829 10.1009 7.72047 9.87832 7.88456 9.71423C8.04866 9.55014 8.27121 9.45795 8.50327 9.45795ZM5.58667 9.45795C5.75972 9.45795 5.92889 9.50927 6.07278 9.60541C6.21667 9.70156 6.32882 9.83821 6.39504 9.99809C6.46127 10.158 6.4786 10.3339 6.44483 10.5036C6.41107 10.6734 6.32774 10.8293 6.20537 10.9516C6.083 11.074 5.9271 11.1573 5.75737 11.1911C5.58764 11.2249 5.41171 11.2075 5.25182 11.1413C5.09194 11.0751 4.95529 10.9629 4.85914 10.819C4.763 10.6752 4.71168 10.506 4.71168 10.3329C4.71168 10.1009 4.80387 9.87832 4.96796 9.71423C5.13205 9.55014 5.35461 9.45795 5.58667 9.45795Z"
            fill="#848484"
          />
          <path
            d="M12.5865 2.16664H12.0032V1.58332C12.0032 1.42861 11.9417 1.28024 11.8323 1.17085C11.723 1.06146 11.5746 1 11.4199 1C11.2652 1 11.1168 1.06146 11.0074 1.17085C10.898 1.28024 10.8366 1.42861 10.8366 1.58332V2.16664H6.16999V1.58332C6.16999 1.42861 6.10853 1.28024 5.99914 1.17085C5.88974 1.06146 5.74137 1 5.58667 1C5.43196 1 5.28359 1.06146 5.1742 1.17085C5.0648 1.28024 5.00334 1.42861 5.00334 1.58332V2.16664H4.42002C3.64678 2.16757 2.90546 2.47515 2.35869 3.02192C1.81193 3.56869 1.50434 4.31 1.50342 5.08325L1.50342 5.66657H15.5031V5.08325C15.5022 4.31 15.1946 3.56869 14.6478 3.02192C14.1011 2.47515 13.3598 2.16757 12.5865 2.16664Z"
            fill="#848484"
          />
        </svg>
        <p
          style={{ color: value ? "#000" : "#848484" }}
          className={classes.searchText}
        >
          {value ? formatDate(value) : dict["when"]}
        </p>
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          className={classes.arrow}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5634 6L8.50342 9.09299L5.44342 6L4.50342 6.95687L8.50342 11L12.5034 6.95687L11.5634 6Z"
            fill="#848484"
          />
        </svg>
      </div>
    </>
  );
}

export default Calendar;
