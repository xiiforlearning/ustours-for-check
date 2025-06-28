"use client";
import { useEffect, useRef, useState } from "react";
import classes from "./MainSearch.module.css";
import { listType } from "@/consts";
function TypeExcursion() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleToggle = () => setOpen(true);

  console.log(open);

  return (
    <div onClick={handleToggle} className={classes.selectExcursion}>
      {open && (
        <div ref={wrapperRef} className={classes.modalType}>
          <div className={classes.cityWrapper}>
            {listType
              .filter((i) => i !== "Тип экскурсии")
              .map((city) => (
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue(city);
                    setOpen(false);
                  }}
                  className={classes.city}
                  key={city}
                >
                  {city}
                </p>
              ))}
          </div>
        </div>
      )}
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.40342 11.6667V13H15.5034V11.6667C15.5034 11.6667 15.5034 9.00001 10.9534 9.00001C6.40342 9.00001 6.40342 11.6667 6.40342 11.6667ZM8.67842 5.33336C8.67842 4.87187 8.81184 4.42075 9.06182 4.03703C9.3118 3.65332 9.66711 3.35425 10.0828 3.17765C10.4985 3.00105 10.9559 2.95484 11.3972 3.04487C11.8386 3.1349 12.2439 3.35713 12.5621 3.68345C12.8803 4.00977 13.0969 4.42553 13.1847 4.87815C13.2725 5.33077 13.2274 5.79993 13.0552 6.22628C12.8831 6.65264 12.5915 7.01706 12.2173 7.27345C11.8432 7.52984 11.4034 7.66669 10.9534 7.66669C10.3501 7.66669 9.7714 7.42085 9.34475 6.98327C8.91811 6.54569 8.67842 5.9522 8.67842 5.33336ZM6.44242 9.00001C6.04283 9.31718 5.71587 9.7203 5.48453 10.181C5.25319 10.6417 5.1231 11.1488 5.10342 11.6667V13H2.50342V11.6667C2.50342 11.6667 2.50342 9.24668 6.44242 9.00001ZM7.05342 3.00004C7.50082 2.99748 7.93838 3.13467 8.30792 3.39337C7.91308 3.95919 7.70078 4.63755 7.70078 5.33336C7.70078 6.02917 7.91308 6.70753 8.30792 7.27335C7.93838 7.53205 7.50082 7.66924 7.05342 7.66669C6.45005 7.66669 5.8714 7.42085 5.44475 6.98327C5.0181 6.54569 4.77842 5.9522 4.77842 5.33336C4.77842 4.71452 5.0181 4.12103 5.44475 3.68345C5.8714 3.24587 6.45005 3.00004 7.05342 3.00004Z"
          fill="#848484"
        />
      </svg>

      <p
        style={{ color: value ? "#000" : "#848484" }}
        className={classes.searchText}
      >
        {value || "Тип экскурсии"}
      </p>
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.5634 6L8.50342 9.09299L5.44342 6L4.50342 6.95687L8.50342 11L12.5034 6.95687L11.5634 6Z"
          fill="#848484"
        />
      </svg>
    </div>
  );
}

export default TypeExcursion;
