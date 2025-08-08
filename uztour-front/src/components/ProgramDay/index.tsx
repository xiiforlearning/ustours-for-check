"use client";
import { useState } from "react";
import classes from "./ProgramDay.module.css";
import { Locale } from "@/i18n-config";
import { Dict } from "@/types";
import { capitalizeFirstLetter } from "@/consts";

function ProgramDay({
  description,
  photos,
  lang,
  index,
  dict,
}: {
  description: string;
  photos: string[];
  lang: Locale;
  index: number;
  dict: Dict;
}) {
  const [open, setOpen] = useState(index != 1);
  lang;

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        height: open ? 75 : "auto",
      }}
      className={classes.container}
    >
      <div className={classes.header}>
        <div className={classes.left}>
          <div className={classes.period}>
            {index + 1} {dict["day"]}
          </div>
        </div>
        <div className={classes.arrowWrapper}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.17501 7.5L10 11.3663L13.8251 7.5L15.0001 8.6961L10 13.75L5 8.6961L6.17501 7.5Z"
              fill="#242D3F"
            />
          </svg>
        </div>
      </div>
      <div className={classes.list}>
        <p
          dangerouslySetInnerHTML={{
            __html: capitalizeFirstLetter(description),
          }}
          className={classes.block}
        ></p>
      </div>
      <div className={classes.listPhotes}>
        {photos.map((item) => (
          <img
            style={{
              width: `calc(${100 / photos.length}% - ${
                (10 * (photos.length - 1)) / photos.length
              }px)`,
            }}
            key={item}
            className={classes.photo}
            src={item}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgramDay;
