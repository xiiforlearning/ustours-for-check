"use client";
import { useEffect, useRef, useState } from "react";
import classes from "./MainSearch.module.css";
import { Dict } from "@/types";
function Select({
  dict,
  onChange,
  data,
  placeHolder,
  svg,
}: {
  dict: Dict;
  onChange: (city: string) => void;
  data: string[];
  placeHolder: string;
  svg?: React.ReactNode;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setOpen(true);

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

  return (
    <>
      <div onClick={handleToggle} className={classes.selectCity}>
        {open && (
          <div ref={wrapperRef} className={classes.modal}>
            <div className={classes.cityWrapper}>
              {data.map((city) => (
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(city);
                    setValue(city);
                    setOpen(false);
                  }}
                  className={classes.city}
                  key={city}
                >
                  {
                    //@ts-expect-error aaa
                    dict[city]
                  }
                </p>
              ))}
            </div>
          </div>
        )}
        {svg ? (
          svg
        ) : (
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.00342 7.175C9.42966 7.175 9.83844 7.0038 10.1398 6.69905C10.4412 6.3943 10.6106 5.98098 10.6106 5.55C10.6106 5.11902 10.4412 4.7057 10.1398 4.40095C9.83844 4.0962 9.42966 3.925 9.00342 3.925C8.57718 3.925 8.16839 4.0962 7.867 4.40095C7.5656 4.7057 7.39628 5.11902 7.39628 5.55C7.39628 5.7634 7.43785 5.97471 7.51861 6.17186C7.59938 6.36901 7.71776 6.54815 7.867 6.69905C8.01623 6.84994 8.1934 6.96964 8.38839 7.0513C8.58338 7.13297 8.79237 7.175 9.00342 7.175ZM9.00342 1C10.1969 1 11.3415 1.47937 12.1854 2.33266C13.0293 3.18595 13.5034 4.34326 13.5034 5.55C13.5034 8.9625 9.00342 14 9.00342 14C9.00342 14 4.50342 8.9625 4.50342 5.55C4.50342 4.34326 4.97752 3.18595 5.82144 2.33266C6.66535 1.47937 7.80994 1 9.00342 1Z"
              fill="#848484"
            />
          </svg>
        )}
        <p
          style={{ color: value ? "#000" : "#848484" }}
          className={classes.searchText}
        >
          {
            //@ts-expect-error aaa
            dict[value] || dict[placeHolder]
          }
        </p>
        <svg
          width="17"
          className={classes.arrow}
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
    </>
  );
}

export default Select;
