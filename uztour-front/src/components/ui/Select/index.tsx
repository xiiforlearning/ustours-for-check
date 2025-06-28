import { ReactNode } from "react";
import classes from "./Select.module.css";

function Select({
  svg,
  value,
  setValue,
  options,
  label,
  contain,
  white,
}: {
  svg?: ReactNode;
  value: string;
  setValue?: (value: string) => void;
  options: string[];
  label?: string;
  contain?: boolean;
  white?: boolean;
}) {
  return (
    <div
      style={contain ? { width: "fit-content" } : {}}
      className={classes.container}
    >
      {label && <p className={classes.label}>{label}</p>}

      <div
        style={{ background: white ? "#fff" : "#F5F5F5" }}
        className={classes.wrapper}
      >
        <svg
          width="8"
          height="5"
          className={classes.arrow}
          viewBox="0 0 8 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 5L7.4641 0.5H0.535898L4 5Z" fill="#242D3F" />
        </svg>
        {svg && <div className={classes.textFieldIcon}>{svg}</div>}

        <select
          style={{
            paddingLeft: svg ? "44px" : "10px",
            background: white ? "#fff" : "#F5F5F5",
          }}
          className={classes.input}
          value={value}
          onChange={(e) => {
            if (!setValue) {
              return;
            }
            setValue(e.target.value);
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Select;
