"use client";
import { cities, listType } from "@/consts";
import Select from "../ui/Select";
import classes from "./Filter.module.css";
import { useState } from "react";

function Filter() {
  const [filterData, setFilterData] = useState({
    city: "",
    type: "",
    lang: "",
    price: "",
    duration: "",
    sort: "",
  });
  const listCity = ["Город", ...cities];

  const listLanguage = ["Язык тура", "Русский", "Английский", "Китайский"];
  const listPrice = ["Цена", "0 - 100 USD", "100-400 USD", "от 400 USD"];
  const listDuration = [
    "Длительность",
    "0-5 часов",
    "Полный день",
    "2 дня",
    "3 дня",
    "4 дня",
    "5 дней",
    "6 дней",
    "7 дней",
    "8 дней",
    "9 дней",
    "10 дней",
    "11 дней",
    "12 дней",
  ];
  const listSort = [
    "Сортировка",
    "Сначала популярные",
    "Сначала дешевле",
    "Сначала дороже",
  ];

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Select
          white
          value={filterData.city ? filterData.city : listCity[0]}
          options={listCity}
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
          options={listType}
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
