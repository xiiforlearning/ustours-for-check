import { ReactNode } from "react";
import classes from "./Calendar.module.css";
import { Calendar as CalendarComp } from "primereact/calendar";
import "primereact/resources/themes/lara-light-cyan/theme.css";

function Calendar({
  svg,
  value,
  setValue,
  label,
}: {
  svg?: ReactNode;
  value: Date | null;
  setValue?: (date: Date | null) => void;
  label?: string;
}) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return (
    <div className={classes.container}>
      {label && <p className={classes.label}>{label}</p>}
      <div className={classes.wrapper}>
        <div className={classes.textFieldIcon}>{svg}</div>
        <div
          className={`${classes.calendarWrapper} ${
            svg ? classes.leftPaddingsvg : classes.leftPadding
          }`}
        >
          <CalendarComp
            value={value}
            onChange={(e) => e.value && setValue && setValue(e.value)}
            showTime
            minDate={tomorrow}
            style={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
            dateFormat={"dd.mm.yy"}
            hourFormat="24"
          />
        </div>
      </div>
    </div>
  );
}

export default Calendar;
