import { useEffect, useRef, useState } from "react";
import classes from "./Header.module.css";
// import Image from "next/image";
function Currency() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const currencies = [
    {
      name: "USD",
      text: "Доллар США",
    },
    {
      name: "EUR",
      text: "Евро",
    },
    {
      name: "UZS",
      text: "Узбекский сум",
    },
    {
      name: "CNY",
      text: "Chinese Yuan",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={classes.btnContainer}>
      <div onClick={() => setOpen(!open)} className={classes.btn}>
        <div className={classes.langContent}>
          <div className={classes.currencyText}>{currentCurrency}</div>
          <span data-v-2a94e252="" className={classes.dropDown}>
            <svg width="12" height="12" viewBox="0 0 48 48" fill="none">
              <path
                d="M22.5409 31.4437L10.5787 18.6839C9.97995 18.0453 10.4328 17 11.3082 17L36.6918 17C37.5672 17 38.0201 18.0453 37.4213 18.6839L25.4591 31.4437C24.6689 32.2865 23.3311 32.2865 22.5409 31.4437Z"
                fill="#757575"
                stroke="#757575"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>
      </div>
      {open && (
        <div className={classes.currencyList}>
          {currencies.map((currency) => (
            <div
              key={currency.name}
              onClick={() => {
                setCurrentCurrency(currency.name);
                setOpen(false);
              }}
              className={classes.currencyItem}
            >
              <div className={classes.currencyName}>{currency.name}</div>
              <div className={classes.currencyText}>{currency.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Currency;
