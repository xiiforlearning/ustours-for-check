"use client";
import { useState } from "react";
import classes from "./ProgramDay.module.css";

function ProgramDay({
  id,
  period,
  title,
  blocks,
  photos,
}: {
  id: number;
  period: string;
  title: string;
  blocks: string[];
  photos: string[];
}) {
  const [open, setOpen] = useState(id != 1);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{ height: open ? "74px" : "auto" }}
      className={classes.container}
    >
      <div className={classes.header}>
        <div className={classes.left}>
          <div className={classes.period}>{period}</div>
          <div className={classes.title}>{title}</div>
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
        {blocks.map((item) => (
          <div className={classes.item} key={item}>
            <div className={classes.dot} />
            <p className={classes.block}>{item}</p>
          </div>
        ))}
      </div>
      <div className={classes.listPhotes}>
        {photos.map((item) => (
          <img key={item} className={classes.photo} src={item} />
        ))}
      </div>
    </div>
  );
}

export default ProgramDay;
