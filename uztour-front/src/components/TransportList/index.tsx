"use client";
import { Dict } from "@/types";
import PrimaryBtn from "../ui/PrimaryBtn";
import classes from "./TransportList.module.css";
import { Locale } from "@/i18n-config";
import { useState } from "react";
// import { useSearchParams } from "next/navigation";
function TransportList({ lang, dict }: { lang: Locale; dict: Dict }) {
  // const searchParams = useSearchParams();
  lang;
  const [mainData, setMainData] = useState<
    {
      image: string;
      name: string;
      people: number;
      baggage: number;
      freeWaitTime: Dict;
      price: number;
    }[]
  >([]);
  const data = [
    {
      image: "/images/car1.png",
      name: "Chevrolet Lacetti",
      people: 2,
      baggage: 2,
      freeWaitTime: {
        ru: "1 часа бесплатно",
        cn: "1 小时免费等待",
        en: "1 hours free wait",
        uz: "1 soat bepul kutish",
      },
      price: 12,
    },
    {
      image: "/images/car2.png",
      name: "Chevrolet Cobalt",
      people: 2,
      baggage: 2,
      freeWaitTime: {
        ru: "2 часа бесплатно",
        cn: "2小时免费等待",
        en: "2 hours free wait",
        uz: "2 soat bepul kutish",
      },
      price: 14,
    },
    {
      image: "/images/car3.png",
      name: "Chevrolet Malibu",
      people: 2,
      baggage: 2,
      freeWaitTime: {
        ru: "1 часа бесплатно",
        cn: "1 小时免费等待",
        en: "1 hours free wait",
        uz: "1 soat bepul kutish",
      },
      price: 16,
    },
  ];

  return (
    <div className={classes.container}>
      {data.map((item) => (
        <div className={classes.item} key={item.image}>
          <img className={classes.carImage} src={item.image} />
          <div className={classes.info}>
            <div className={classes.topInfo}>
              <p className={classes.name}>{item.name}</p>

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
              <svg
                width="33"
                height="32"
                viewBox="0 0 33 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="0.5" width="32" height="32" rx="8" fill="white" />
                <path
                  d="M18.5473 15.5007L17.9473 16.114C17.4673 16.594 17.1673 17.0007 17.1673 18.0007H15.834V17.6673C15.834 16.9273 16.134 16.2607 16.614 15.7807L17.4407 14.9407C17.6873 14.7007 17.834 14.3673 17.834 14.0007C17.834 13.2607 17.234 12.6673 16.5007 12.6673C16.147 12.6673 15.8079 12.8078 15.5578 13.0578C15.3078 13.3079 15.1673 13.647 15.1673 14.0007H13.834C13.834 13.2934 14.1149 12.6151 14.615 12.115C15.1151 11.6149 15.7934 11.334 16.5007 11.334C17.2079 11.334 17.8862 11.6149 18.3863 12.115C18.8864 12.6151 19.1673 13.2934 19.1673 14.0007C19.1673 14.5873 18.9273 15.114 18.5473 15.5007ZM17.1673 20.6673H15.834V19.334H17.1673V20.6673ZM16.5007 9.33398C15.6252 9.33398 14.7583 9.50642 13.9494 9.84145C13.1406 10.1765 12.4057 10.6675 11.7866 11.2866C10.5364 12.5368 9.83398 14.2325 9.83398 16.0007C9.83398 17.7688 10.5364 19.4645 11.7866 20.7147C12.4057 21.3338 13.1406 21.8248 13.9494 22.1598C14.7583 22.4949 15.6252 22.6673 16.5007 22.6673C18.2688 22.6673 19.9645 21.9649 21.2147 20.7147C22.4649 19.4645 23.1673 17.7688 23.1673 16.0007C23.1673 12.314 20.1673 9.33398 16.5007 9.33398Z"
                  fill="#BBBBBB"
                />
              </svg>
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
                  {dict.freeWait}: 2 {dict["hours"]}
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
            <div className={classes.moreInfo}>
              <p className={classes.moreInfoText}>{dict["more"]}</p>
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.6582 13.8167L11.4749 10L7.6582 6.175L8.8332 5L13.8332 10L8.8332 15L7.6582 13.8167Z"
                  fill="#328AEE"
                />
              </svg>
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
