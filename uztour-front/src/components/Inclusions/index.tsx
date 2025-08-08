import { Dict, ResponseTour } from "@/types";
import classes from "./Inclusions.module.css";
import { capitalizeFirstLetter } from "@/consts";

export function Inclusions({
  dict,
  currentExcursion,
}: {
  dict: Dict;
  currentExcursion: ResponseTour;
}) {
  return (
    <div>
      <h2 className={classes.title}>{dict.includedInPrice}</h2>
      <div className={classes.container}>
        <div className={classes.content}>
          {currentExcursion.included
            .filter((i) => i)
            .map((item) => (
              <div className={classes.item} key={item}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="14" height="14" rx="7" fill="#1BB747" />
                  <path
                    d="M10.3337 4.5L5.75033 9.08333L3.66699 7"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>{capitalizeFirstLetter(item)}</p>
              </div>
            ))}
        </div>
        <div className={classes.content}>
          {currentExcursion.excluded
            .filter((i) => i)
            .map((item) => (
              <div className={classes.item} key={item}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M7 7L13 13"
                    stroke="#BBBBBB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 13L13 7"
                    stroke="#BBBBBB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p>{capitalizeFirstLetter(item)}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Inclusions;
