import Image from "next/image";
import classes from "./BurgerMenu.module.css";
import { useState } from "react";
import { Locale } from "@/i18n-config";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Dict, UserType } from "@/types";
import useStore from "@/store/useStore";
function BurgerMenu({
  burgerOpen,
  lang,
  dict,
  user,
  setBurgerOpen,
}: {
  burgerOpen: boolean;
  lang: Locale;
  dict: Dict;
  user: 0 | UserType | null;
  setBurgerOpen: (value: boolean) => void;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const pathname = usePathname();
  const setUser = useStore((state) => state.setUser);

  const langs = [
    {
      img: "/images/ru.svg",
      name: "Рус",
      code: "ru",
    },
    {
      img: "/images/en.svg",
      name: "Eng",
      code: "en",
    },
    {
      img: "/images/uz.svg",
      name: "Uzb",
      code: "uz",
    },
    {
      img: "/images/china.svg",
      name: "中国人",
      code: "cn",
    },
  ];

  const cleanPath = pathname.replace(/^\/(ru|en|uz)/, "");
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setBurgerOpen(false);
  };

  return (
    <div className={`${classes.menu} ${burgerOpen ? classes.open : ""}`}>
      {user && user.user.type == "partner" && (
        <>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}/profile`}
            className={classes.navItem}
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.252 3.75C12.1636 3.75 13.038 4.11216 13.6826 4.75682C14.3273 5.40148 14.6895 6.27582 14.6895 7.1875C14.6895 8.09918 14.3273 8.97352 13.6826 9.61818C13.038 10.2628 12.1636 10.625 11.252 10.625C10.3403 10.625 9.46593 10.2628 8.82127 9.61818C8.17662 8.97352 7.81445 8.09918 7.81445 7.1875C7.81445 6.27582 8.17662 5.40148 8.82127 4.75682C9.46593 4.11216 10.3403 3.75 11.252 3.75ZM11.252 12.3438C15.0504 12.3438 18.127 13.882 18.127 15.7812V17.5H4.37695V15.7812C4.37695 13.882 7.45352 12.3438 11.252 12.3438Z"
                fill="#242D3F"
              ></path>
            </svg>

            <p className={classes.navItemText}>{dict["myProfile"]}</p>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}/guide-tours`}
            className={classes.navItem}
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.62777 2.5C5.84878 2.5 6.06074 2.5878 6.21702 2.74408C6.3733 2.90036 6.4611 3.11232 6.4611 3.33333V4.06667C7.34443 3.7 8.54443 3.33333 9.79443 3.33333C12.2944 3.33333 12.2944 5 13.9611 5C16.4611 5 17.2944 3.33333 17.2944 3.33333V10C17.2944 10 16.4611 11.6667 13.9611 11.6667C11.4611 11.6667 11.4611 10 9.79443 10C7.29443 10 6.4611 11.6667 6.4611 11.6667V17.5H4.79443V3.33333C4.79443 3.11232 4.88223 2.90036 5.03851 2.74408C5.19479 2.5878 5.40675 2.5 5.62777 2.5Z"
                fill="#242D3F"
              ></path>
            </svg>

            <p className={classes.navItemText}>{dict["myTours"]}</p>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}/guide-bookings`}
            className={classes.navItem}
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.96029 14.1654L5.62695 10.832L6.80195 9.65703L8.96029 11.807L14.452 6.31536L15.627 7.4987L8.96029 14.1654ZM10.627 2.4987C10.848 2.4987 11.0599 2.5865 11.2162 2.74278C11.3725 2.89906 11.4603 3.11102 11.4603 3.33203C11.4603 3.55305 11.3725 3.76501 11.2162 3.92129C11.0599 4.07757 10.848 4.16536 10.627 4.16536C10.4059 4.16536 10.194 4.07757 10.0377 3.92129C9.88142 3.76501 9.79362 3.55305 9.79362 3.33203C9.79362 3.11102 9.88142 2.89906 10.0377 2.74278C10.194 2.5865 10.4059 2.4987 10.627 2.4987ZM16.4603 2.4987H12.977C12.627 1.53203 11.7103 0.832031 10.627 0.832031C9.54362 0.832031 8.62695 1.53203 8.27695 2.4987H4.79362C4.35159 2.4987 3.92767 2.67429 3.61511 2.98685C3.30255 3.29941 3.12695 3.72334 3.12695 4.16536V15.832C3.12695 16.2741 3.30255 16.698 3.61511 17.0105C3.92767 17.3231 4.35159 17.4987 4.79362 17.4987H16.4603C16.9023 17.4987 17.3262 17.3231 17.6388 17.0105C17.9514 16.698 18.127 16.2741 18.127 15.832V4.16536C18.127 3.72334 17.9514 3.29941 17.6388 2.98685C17.3262 2.67429 16.9023 2.4987 16.4603 2.4987Z"
                fill="#242D3F"
              ></path>
            </svg>

            <p className={classes.navItemText}>{dict.bookings}</p>
          </Link>
        </>
      )}

      {((user && user.user.type !== "partner") || !user) && (
        <>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}`}
            className={classes.navItem}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.99996 2L13.3333 6V14H9.99996V9.33333H5.99996V14H2.66663V6L7.99996 2Z"
                fill="#242D3F"
              />
            </svg>

            <p className={classes.navItemText}>{dict["main"]}</p>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}/tours`}
            className={classes.navItem}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.00065 2C4.17746 2 4.34703 2.07024 4.47206 2.19526C4.59708 2.32029 4.66732 2.48986 4.66732 2.66667V3.25333C5.37398 2.96 6.33398 2.66667 7.33398 2.66667C9.33398 2.66667 9.33398 4 10.6673 4C12.6673 4 13.334 2.66667 13.334 2.66667V8C13.334 8 12.6673 9.33333 10.6673 9.33333C8.66732 9.33333 8.66732 8 7.33398 8C5.33398 8 4.66732 9.33333 4.66732 9.33333V14H3.33398V2.66667C3.33398 2.48986 3.40422 2.32029 3.52925 2.19526C3.65427 2.07024 3.82384 2 4.00065 2Z"
                fill="#242D3F"
              />
            </svg>

            <p className={classes.navItemText}>{dict["header.excursions"]}</p>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}/transfer`}
            className={classes.navItem}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1192_83174)">
                <path
                  d="M12.6133 4.00536C12.48 3.61203 12.1067 3.33203 11.6667 3.33203H4.33333C3.89333 3.33203 3.52667 3.61203 3.38667 4.00536L2 7.9987V13.332C2 13.6987 2.3 13.9987 2.66667 13.9987H3.33333C3.7 13.9987 4 13.6987 4 13.332V12.6654H12V13.332C12 13.6987 12.3 13.9987 12.6667 13.9987H13.3333C13.7 13.9987 14 13.6987 14 13.332V7.9987L12.6133 4.00536ZM4.33333 10.6654C3.78 10.6654 3.33333 10.2187 3.33333 9.66536C3.33333 9.11203 3.78 8.66536 4.33333 8.66536C4.88667 8.66536 5.33333 9.11203 5.33333 9.66536C5.33333 10.2187 4.88667 10.6654 4.33333 10.6654ZM11.6667 10.6654C11.1133 10.6654 10.6667 10.2187 10.6667 9.66536C10.6667 9.11203 11.1133 8.66536 11.6667 8.66536C12.22 8.66536 12.6667 9.11203 12.6667 9.66536C12.6667 10.2187 12.22 10.6654 11.6667 10.6654ZM3.33333 7.33203L4.33333 4.33203H11.6667L12.6667 7.33203H3.33333Z"
                  fill="#242D3F"
                />
              </g>
              <defs>
                <clipPath id="clip0_1192_83174">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <p className={classes.navItemText}>
              {dict["header.order_transfer"]}
            </p>
          </Link>
        </>
      )}

      {user && user.user.type !== "partner" && (
        <>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}/transfer`}
            className={classes.navItem}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.00065 2C4.17746 2 4.34703 2.07024 4.47206 2.19526C4.59708 2.32029 4.66732 2.48986 4.66732 2.66667V3.25333C5.37398 2.96 6.33398 2.66667 7.33398 2.66667C9.33398 2.66667 9.33398 4 10.6673 4C12.6673 4 13.334 2.66667 13.334 2.66667V8C13.334 8 12.6673 9.33333 10.6673 9.33333C8.66732 9.33333 8.66732 8 7.33398 8C5.33398 8 4.66732 9.33333 4.66732 9.33333V14H3.33398V2.66667C3.33398 2.48986 3.40422 2.32029 3.52925 2.19526C3.65427 2.07024 3.82384 2 4.00065 2Z"
                fill="#242D3F"
              />
            </svg>

            <p className={classes.navItemText}>{dict["yourTours"]}</p>
          </Link>
          <Link
            onClick={() => setBurgerOpen(false)}
            href={`/${lang}/transfer`}
            className={classes.navItem}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1192_83174)">
                <path
                  d="M12.6133 4.00536C12.48 3.61203 12.1067 3.33203 11.6667 3.33203H4.33333C3.89333 3.33203 3.52667 3.61203 3.38667 4.00536L2 7.9987V13.332C2 13.6987 2.3 13.9987 2.66667 13.9987H3.33333C3.7 13.9987 4 13.6987 4 13.332V12.6654H12V13.332C12 13.6987 12.3 13.9987 12.6667 13.9987H13.3333C13.7 13.9987 14 13.6987 14 13.332V7.9987L12.6133 4.00536ZM4.33333 10.6654C3.78 10.6654 3.33333 10.2187 3.33333 9.66536C3.33333 9.11203 3.78 8.66536 4.33333 8.66536C4.88667 8.66536 5.33333 9.11203 5.33333 9.66536C5.33333 10.2187 4.88667 10.6654 4.33333 10.6654ZM11.6667 10.6654C11.1133 10.6654 10.6667 10.2187 10.6667 9.66536C10.6667 9.11203 11.1133 8.66536 11.6667 8.66536C12.22 8.66536 12.6667 9.11203 12.6667 9.66536C12.6667 10.2187 12.22 10.6654 11.6667 10.6654ZM3.33333 7.33203L4.33333 4.33203H11.6667L12.6667 7.33203H3.33333Z"
                  fill="#242D3F"
                />
              </g>
              <defs>
                <clipPath id="clip0_1192_83174">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <p className={classes.navItemText}>{dict["header.transfer"]}</p>
          </Link>
        </>
      )}
      {user && (
        <div onClick={logout} className={classes.navItem}>
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
              d="M6.88306 1.88841C7.15183 1.80779 7.43571 1.79111 7.71207 1.83971C7.98842 1.8883 8.24959 2.00083 8.47472 2.16831C8.69985 2.33579 8.88271 2.55358 9.00871 2.8043C9.1347 3.05501 9.20035 3.33171 9.20039 3.6123V12.3872C9.20035 12.6678 9.1347 12.9445 9.00871 13.1952C8.88271 13.4459 8.69985 13.6637 8.47472 13.8312C8.24959 13.9986 7.98842 14.1112 7.71207 14.1598C7.43571 14.2084 7.15183 14.1917 6.88306 14.1111L3.28287 13.031C2.91211 12.9198 2.58708 12.692 2.35599 12.3815C2.1249 12.071 2.00006 11.6942 2 11.3071V4.69236C2.00006 4.30528 2.1249 3.92853 2.35599 3.61799C2.58708 3.30746 2.91211 3.07969 3.28287 2.96847L6.88306 1.88841ZM9.80042 3.19948C9.80042 3.04034 9.86364 2.88772 9.97617 2.77519C10.0887 2.66267 10.2413 2.59945 10.4005 2.59945H12.2006C12.678 2.59945 13.1358 2.7891 13.4734 3.12668C13.811 3.46427 14.0007 3.92213 14.0007 4.39955V4.99958C14.0007 5.15872 13.9374 5.31134 13.8249 5.42386C13.7124 5.53639 13.5598 5.59961 13.4006 5.59961C13.2415 5.59961 13.0889 5.53639 12.9763 5.42386C12.8638 5.31134 12.8006 5.15872 12.8006 4.99958V4.39955C12.8006 4.24041 12.7374 4.08779 12.6248 3.97526C12.5123 3.86273 12.3597 3.79951 12.2006 3.79951H10.4005C10.2413 3.79951 10.0887 3.7363 9.97617 3.62377C9.86364 3.51124 9.80042 3.35862 9.80042 3.19948ZM13.4006 10.3999C13.5598 10.3999 13.7124 10.4631 13.8249 10.5756C13.9374 10.6881 14.0007 10.8408 14.0007 10.9999V11.5999C14.0007 12.0774 13.811 12.5352 13.4734 12.8728C13.1358 13.2104 12.678 13.4 12.2006 13.4H10.4005C10.2413 13.4 10.0887 13.3368 9.97617 13.2243C9.86364 13.1118 9.80042 12.9591 9.80042 12.8C9.80042 12.6409 9.86364 12.4882 9.97617 12.3757C10.0887 12.2632 10.2413 12.2 10.4005 12.2H12.2006C12.3597 12.2 12.5123 12.1368 12.6248 12.0242C12.7374 11.9117 12.8006 11.7591 12.8006 11.5999V10.9999C12.8006 10.8408 12.8638 10.6881 12.9763 10.5756C13.0889 10.4631 13.2415 10.3999 13.4006 10.3999ZM6.20023 7.39971C6.04109 7.39971 5.88847 7.46293 5.77594 7.57545C5.66341 7.68798 5.6002 7.8406 5.6002 7.99974C5.6002 8.15888 5.66341 8.3115 5.77594 8.42403C5.88847 8.53656 6.04109 8.59977 6.20023 8.59977H6.20083C6.35997 8.59977 6.51259 8.53656 6.62512 8.42403C6.73764 8.3115 6.80086 8.15888 6.80086 7.99974C6.80086 7.8406 6.73764 7.68798 6.62512 7.57545C6.51259 7.46293 6.35997 7.39971 6.20083 7.39971H6.20023Z"
              fill="#E13131"
            />
            <path
              d="M10.4004 7.99889H13.4006H10.4004ZM13.4006 7.99889L12.2005 6.79883L13.4006 7.99889ZM13.4006 7.99889L12.2005 9.19896L13.4006 7.99889Z"
              fill="#E13131"
            />
            <path
              d="M10.4004 7.99889H13.4006M13.4006 7.99889L12.2005 6.79883M13.4006 7.99889L12.2005 9.19896"
              stroke="#E13131"
              strokeWidth="1.8001"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p style={{ color: "#E13131" }} className={classes.navItemText}>
            {dict["header.logout"]}
          </p>
        </div>
      )}
      {((user && user.user.type != "partner") || !user) && (
        <>
          <div style={{ height: 30 }}></div>
          <div>
            <p className={classes.label}>{dict.langs}:</p>
            <div className={classes.horizontalList}>
              {langs.map((item) => (
                <Link
                  href={`/${item.code}${cleanPath}`}
                  className={`${classes.lang} ${
                    lang == item.code ? classes.selectedLang : ""
                  }`}
                  key={item.img}
                >
                  <Image
                    alt={item.name}
                    width={17.4}
                    height={13}
                    src={item.img}
                  />
                  <p>{item.name}</p>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ height: 20 }}></div>
          <div>
            <p className={classes.label}>{dict["currency"]}:</p>
            <div className={classes.horizontalList}>
              <div
                onClick={() => setSelectedCurrency("USD")}
                className={`${classes.lang} ${
                  selectedCurrency == "USD" ? classes.selectedLang : ""
                }`}
              >
                USD
              </div>
              <div
                onClick={() => setSelectedCurrency("EUR")}
                className={`${classes.currency} ${
                  selectedCurrency == "EUR" ? classes.selectedCurrency : ""
                }`}
              >
                EUR
              </div>
              <div
                onClick={() => setSelectedCurrency("UZS")}
                className={`${classes.currency} ${
                  selectedCurrency == "UZS" ? classes.selectedCurrency : ""
                }`}
              >
                UZS
              </div>
              <div
                onClick={() => setSelectedCurrency("CNY")}
                className={`${classes.currency} ${
                  selectedCurrency == "CNY" ? classes.selectedCurrency : ""
                }`}
              >
                CNY
              </div>
            </div>
          </div>
          <div style={{ height: 30 }}></div>
          <div className={classes.contact}>
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.25 9.81445H12.75C12.75 8.81989 12.3549 7.86606 11.6517 7.1628C10.9484 6.45954 9.99456 6.06445 9 6.06445V7.56445C9.59674 7.56445 10.169 7.80151 10.591 8.22346C11.0129 8.64542 11.25 9.21772 11.25 9.81445ZM14.25 9.81445H15.75C15.75 6.06445 12.7275 3.06445 9 3.06445V4.56445C11.895 4.56445 14.25 6.91195 14.25 9.81445ZM15 12.4395C14.0625 12.4395 13.1625 12.2895 12.3225 12.012C12.06 11.9295 11.7675 11.9895 11.5575 12.1995L9.9075 13.8495C7.785 12.7695 6.045 11.0295 4.965 8.90695L6.615 7.25695C6.825 7.04695 6.885 6.75445 6.8025 6.49195C6.525 5.65195 6.375 4.75195 6.375 3.81445C6.375 3.61554 6.29598 3.42478 6.15533 3.28412C6.01468 3.14347 5.82391 3.06445 5.625 3.06445H3C2.80109 3.06445 2.61032 3.14347 2.46967 3.28412C2.32902 3.42478 2.25 3.61554 2.25 3.81445C2.25 7.19596 3.5933 10.439 5.98439 12.8301C8.37548 15.2212 11.6185 16.5645 15 16.5645C15.1989 16.5645 15.3897 16.4854 15.5303 16.3448C15.671 16.2041 15.75 16.0134 15.75 15.8145V13.1895C15.75 12.9905 15.671 12.7998 15.5303 12.6591C15.3897 12.5185 15.1989 12.4395 15 12.4395Z"
                fill="#328AEE"
              />
            </svg>
            <p className={classes.contactText}>+998 (99) 893-95-22</p>
          </div>
          <div className={classes.contact}>
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.0007 6.81445L9.00073 10.5645L3.00073 6.81445V5.31445L9.00073 9.06445L15.0007 5.31445V6.81445ZM15.0007 3.81445H3.00073C2.16823 3.81445 1.50073 4.48195 1.50073 5.31445V14.3145C1.50073 14.7123 1.65877 15.0938 1.94007 15.3751C2.22138 15.6564 2.60291 15.8145 3.00073 15.8145H15.0007C15.3986 15.8145 15.7801 15.6564 16.0614 15.3751C16.3427 15.0938 16.5007 14.7123 16.5007 14.3145V5.31445C16.5007 4.48195 15.8257 3.81445 15.0007 3.81445Z"
                fill="#328AEE"
              />
            </svg>

            <p className={classes.contactText}>uztours@gmail.com</p>
          </div>
        </>
      )}
    </div>
  );
}

export default BurgerMenu;
