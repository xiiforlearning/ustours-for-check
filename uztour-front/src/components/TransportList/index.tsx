"use client";
import { Dict } from "@/types";
import PrimaryBtn from "../ui/PrimaryBtn";
import classes from "./TransportList.module.css";
import { Locale } from "@/i18n-config";
// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
function TransportList({ lang, dict }: { lang: Locale; dict: Dict }) {
  // const searchParams = useSearchParams();
  lang;
  // const [mainData, setMainData] = useState<
  //   {
  //     image: string;
  //     name: string;
  //     people: number;
  //     baggage: number;
  //     freeWaitTime: Dict;
  //     price: number;
  //   }[]
  // >([]);
  const data = [
    {
      image: "/images/sedan.svg",
      name: "sedan",
      people: 2,
      baggage: 2,
      type: "sedan",
      freeWaitTime: {
        ru: "1.5 часа",
        cn: "1.5 小时",
        en: "1.5 hours",
        uz: "1.5 soat",
      },
      price: 20,
    },
    {
      image: "/images/minivan.svg",
      name: "minivan",
      people: 9,
      baggage: 6,
      freeWaitTime: {
        ru: "1.5 часа",
        cn: "1.5 小时",
        en: "1.5 hours",
        uz: "1.5 soat",
      },
      price: 35,
      type: "minivan",
    },
  ];

  return (
    <div className={classes.container}>
      {data.map((item) => (
        <div className={classes.item} key={item.image}>
          <img className={classes.carImage} src={item.image} />
          <div className={classes.info}>
            <div className={classes.topInfo}>
              <p className={classes.name}>
                {
                  //@ts-expect-error aaa
                  dict[item.name]
                }
              </p>

              <div className={classes.infoItem}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.46875 3.3125C9.15251 3.3125 9.80827 3.58412 10.2918 4.06762C10.7753 4.55111 11.0469 5.20686 11.0469 5.89062C11.0469 6.57439 10.7753 7.23014 10.2918 7.71363C9.80827 8.19713 9.15251 8.46875 8.46875 8.46875C7.78499 8.46875 7.12923 8.19713 6.64574 7.71363C6.16225 7.23014 5.89062 6.57439 5.89062 5.89062C5.89062 5.20686 6.16225 4.55111 6.64574 4.06762C7.12923 3.58412 7.78499 3.3125 8.46875 3.3125ZM8.46875 9.75781C11.3176 9.75781 13.625 10.9115 13.625 12.3359V13.625H3.3125V12.3359C3.3125 10.9115 5.61992 9.75781 8.46875 9.75781Z"
                    fill="#848484"
                  />
                </svg>
                <p className={classes.infoItemText}>{item.people}</p>
              </div>
              <div className={classes.infoItem}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.75049 10.5V9.875H2.37549V12.375C2.37549 13.0688 2.93174 13.625 3.62549 13.625H12.3755C13.0692 13.625 13.6255 13.0688 13.6255 12.375V9.875H9.25049V10.5H6.75049ZM13.0005 4.875H10.5005V3.625L9.25049 2.375H6.75049L5.50049 3.625V4.875H3.00049C2.31299 4.875 1.75049 5.4375 1.75049 6.125V8C1.75049 8.69375 2.30674 9.25 3.00049 9.25H6.75049V8H9.25049V9.25H13.0005C13.688 9.25 14.2505 8.6875 14.2505 8V6.125C14.2505 5.4375 13.688 4.875 13.0005 4.875ZM9.25049 4.875H6.75049V3.625H9.25049V4.875Z"
                    fill="#848484"
                  />
                </svg>

                <p className={classes.infoItemText}>{item.baggage}</p>
              </div>
            </div>

            <div className={classes.features}>
              <div className={classes.feature}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.99878 1.74805C4.56128 1.74805 1.74878 4.56055 1.74878 7.99805C1.74878 11.4355 4.56128 14.248 7.99878 14.248C11.4363 14.248 14.2488 11.4355 14.2488 7.99805C14.2488 4.56055 11.4363 1.74805 7.99878 1.74805ZM10.6863 9.99805L7.37378 8.18555V4.87305H8.31128V7.62305L11.1238 9.18555L10.6863 9.99805Z"
                    fill="#0FA53A"
                  />
                </svg>

                <p className={classes.featureText}>
                  {dict.freeWait}:{" "}
                  {lang == "cn"
                    ? item.freeWaitTime.cn
                    : lang == "en"
                    ? item.freeWaitTime.en
                    : lang == "ru"
                    ? item.freeWaitTime.ru
                    : item.freeWaitTime.uz}
                </p>
              </div>
              <div className={classes.feature}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.46875 3.3125C9.15251 3.3125 9.80827 3.58412 10.2918 4.06762C10.7753 4.55111 11.0469 5.20686 11.0469 5.89062C11.0469 6.57439 10.7753 7.23014 10.2918 7.71363C9.80827 8.19713 9.15251 8.46875 8.46875 8.46875C7.78499 8.46875 7.12923 8.19713 6.64574 7.71363C6.16225 7.23014 5.89062 6.57439 5.89062 5.89062C5.89062 5.20686 6.16225 4.55111 6.64574 4.06762C7.12923 3.58412 7.78499 3.3125 8.46875 3.3125ZM8.46875 9.75781C11.3176 9.75781 13.625 10.9115 13.625 12.3359V13.625H3.3125V12.3359C3.3125 10.9115 5.61992 9.75781 8.46875 9.75781Z"
                    fill="#0FA53A"
                  />
                </svg>

                <p className={classes.featureText}>
                  {dict["meetingAndGreeting"]}
                </p>
              </div>
              <div className={classes.feature}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="15"
                    height="15"
                    rx="7.5"
                    fill="#1BB747"
                  />
                  <path
                    d="M12 5L6.5 10.5L4 8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p className={classes.featureText}>{dict["securityChecked"]}</p>
              </div>
              <div className={classes.feature}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="15"
                    height="15"
                    rx="7.5"
                    fill="#1BB747"
                  />
                  <path
                    d="M12 5L6.5 10.5L4 8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <p className={classes.featureText}>
                  {dict["instantConfirmation"]}
                </p>
              </div>
            </div>
          </div>
          <div className={classes.priceContent}>
            <p className={classes.price}>{item.price} USD</p>
            <PrimaryBtn text={dict["book"]} onClick={() => {}} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TransportList;
