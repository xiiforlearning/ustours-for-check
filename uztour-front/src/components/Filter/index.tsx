"use client";
import { cities, langs, listType } from "@/consts";
import Select from "../ui/Select";
import classes from "./Filter.module.css";
import { useState } from "react";
import { Dict } from "@/types";

function Filter({ dict }: { dict: Dict }) {
  const [filterData, setFilterData] = useState({
    city: "",
    type: "",
    lang: "",
    price: "",
    duration: "",
    sort: "",
  });
  const listCity = ["city", ...cities];
  //@ts-expect-error aaa
  const listLanguage = langs.map((lang) => dict[lang]);
  const listPrice = [
    dict["price"],
    "0 - 100 USD",
    "100-400 USD",
    dict["from2"] + " 400 USD",
  ];
  const listDuration = [
    dict["duration"],
    "0-5 " + dict["hour"],
    dict["fullDay"],
    "2 " + dict["day"],
    "3 " + dict["day"],
    "4 " + dict["day"],
    "5 " + dict["day"],
    "6 " + dict["day"],
    "7 " + dict["day"],
    "8 " + dict["day2"],
    "9 " + dict["day2"],
    "10 " + dict["day2"],
    "11 " + dict["day2"],
    "12 " + dict["day2"],
  ];
  const listSort = [
    dict["sort"],
    dict["fromPopular"],
    dict["fromCheap"],
    dict["fromExpensive"],
  ];

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Select
          white
          value={filterData.city ? filterData.city : listCity[0]}
          //@ts-expect-error aaa
          options={listCity.map((city) => dict[city])}
          contain={true}
          setValue={(value) =>
            value != listCity[0]
              ? setFilterData({ ...filterData, city: value })
              : setFilterData({ ...filterData, city: "" })
          }
        />
        <Select
          white
          value={filterData.type ? filterData.type : listType[0]}
          options={listType.map(
            //@ts-expect-error aaa
            (type) => dict[type].charAt(0).toUpperCase() + dict[type].slice(1)
          )}
          contain={true}
          setValue={(value) =>
            value != listType[0]
              ? setFilterData({ ...filterData, type: value })
              : setFilterData({ ...filterData, type: "" })
          }
        />
        <Select
          white
          value={filterData.lang ? filterData.lang : listLanguage[0]}
          options={listLanguage}
          contain={true}
          setValue={(value) =>
            value != listLanguage[0]
              ? setFilterData({ ...filterData, lang: value })
              : setFilterData({ ...filterData, lang: "" })
          }
        />

        <Select
          white
          value={filterData.price ? filterData.price : listPrice[0]}
          options={listPrice}
          contain={true}
          setValue={(value) =>
            value != listPrice[0]
              ? setFilterData({ ...filterData, price: value })
              : setFilterData({ ...filterData, price: "" })
          }
        />
        <Select
          white
          value={filterData.duration ? filterData.duration : listDuration[0]}
          options={listDuration}
          contain={true}
          setValue={(value) =>
            value != listDuration[0]
              ? setFilterData({ ...filterData, duration: value })
              : setFilterData({ ...filterData, duration: "" })
          }
        />
      </div>
      <div className={classes.right}>
        <Select
          white
          value={filterData.sort ? filterData.sort : listSort[0]}
          options={listSort}
          svg={
            <svg
              width="13"
              height="12"
              style={{
                position: "absolute",
                left: "10px",
                top: "0px",
                bottom: "0px",
                marginTop: "auto",
                marginBottom: "auto",
              }}
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.875 2.875H12.75L10.25 0.375L7.75 2.875H9.625V11.625H10.875V2.875ZM0.25 9.125H6.5V10.375H0.25V9.125ZM2.75 1.625V2.875H0.25V1.625H2.75ZM0.25 5.375H4.625V6.625H0.25V5.375Z"
                fill="#242D3F"
              />
            </svg>
          }
          contain={true}
          setValue={(value) =>
            value != listSort[0]
              ? setFilterData({ ...filterData, sort: value })
              : setFilterData({ ...filterData, sort: "" })
          }
        />
      </div>
    </div>
  );
}

export default Filter;
