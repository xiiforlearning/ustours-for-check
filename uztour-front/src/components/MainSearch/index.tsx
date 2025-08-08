import Link from "next/link";
import classes from "./MainSearch.module.css";
import Select from "./Select";
import TypeExcursion from "./TypeExcursion";
import { Dict } from "@/types";
import { useState } from "react";
import { cities, langs } from "@/consts";

function MainSearch({ dict }: { dict: Dict }) {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  return (
    <div className={classes.mainSearch}>
      <div className={classes.searchTop}>
        <Select
          placeHolder={"city"}
          data={cities}
          onChange={setSelectedCity}
          dict={dict}
        />
        <Select
          placeHolder="lang"
          data={langs}
          svg={
            <svg
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.52486 8.6657L6.90128 7.13617L6.92045 7.11789C8.03267 5.9357 8.82528 4.5768 9.2919 3.13867H11.1648V1.91992H6.69034V0.701172H5.41193V1.91992H0.9375V3.13867H8.07741C7.64915 4.30867 6.97159 5.42383 6.05114 6.39883C5.45668 5.77117 4.96449 5.08258 4.57457 4.35742H3.29616C3.76278 5.3507 4.40199 6.28914 5.20099 7.13617L1.94744 10.1952L2.85511 11.0605L6.05114 8.01367L8.03906 9.90883L8.52486 8.6657ZM12.1236 5.57617H10.8452L7.96875 12.8887H9.24716L9.96307 11.0605H12.9993L13.7216 12.8887H15L12.1236 5.57617ZM10.4489 9.8418L11.4844 7.2032L12.5199 9.8418H10.4489Z"
                fill="#848484"
              ></path>
            </svg>
          }
          onChange={setSelectedLang}
          dict={dict}
        />
      </div>

      <TypeExcursion onChange={setSelectedType} dict={dict} />
      <Link
        href={
          "/tours?page=1" +
          (selectedCity ? "&city=" + selectedCity : "") +
          (selectedLang ? "&languages=" + selectedLang : "") +
          (selectedType ? "&type=" + selectedType : "")
        }
        className={classes.btn}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.17591 2.66609C5.98073 2.66609 4.83449 3.1409 3.98937 3.98605C3.14425 4.83121 2.66946 5.97748 2.66946 7.17271C2.66946 8.36794 3.14425 9.51421 3.98937 10.3594C4.83449 11.2045 5.98073 11.6793 7.17591 11.6793C8.3711 11.6793 9.51733 11.2045 10.3625 10.3594C11.2076 9.51421 11.6824 8.36794 11.6824 7.17271C11.6824 5.97748 11.2076 4.83121 10.3625 3.98605C9.51733 3.1409 8.3711 2.66609 7.17591 2.66609ZM1.44043 7.17271C1.44051 6.25555 1.66052 5.35178 2.08201 4.53721C2.5035 3.72264 3.11418 3.02103 3.86281 2.49123C4.61145 1.96144 5.47622 1.6189 6.38458 1.49236C7.29293 1.36581 8.21839 1.45896 9.08332 1.76397C9.94824 2.06898 10.7274 2.57697 11.3555 3.24533C11.9835 3.91369 12.4422 4.72291 12.6929 5.60514C12.9436 6.48736 12.9791 7.41685 12.7965 8.31563C12.6138 9.21442 12.2183 10.0563 11.643 10.7706L14.3698 13.4984C14.4302 13.5546 14.4786 13.6225 14.5122 13.6978C14.5458 13.7732 14.5639 13.8546 14.5653 13.9371C14.5668 14.0196 14.5516 14.1016 14.5207 14.1781C14.4898 14.2546 14.4438 14.3242 14.3854 14.3825C14.3271 14.4409 14.2576 14.4869 14.1811 14.5178C14.1045 14.5487 14.0226 14.5639 13.9401 14.5624C13.8576 14.5609 13.7762 14.5429 13.7008 14.5093C13.6254 14.4757 13.5576 14.4273 13.5013 14.3669L10.7737 11.64C9.93103 12.3188 8.91355 12.7453 7.83877 12.8704C6.764 12.9954 5.67577 12.8139 4.69978 12.3467C3.72379 11.8796 2.89984 11.1459 2.3231 10.2303C1.74636 9.31479 1.44036 8.25477 1.44043 7.17271Z"
            fill="white"
          />
        </svg>
        <p className={classes.btnText}>{dict["search2"]}</p>
      </Link>
    </div>
  );
}

export default MainSearch;
