"use client";
import useStore from "@/store/useStore";
// import Search from "../Search";
import classes from "./Header.module.css";
import LangBtn from "./LangBtn";
import Image from "next/image";
import LoginModal from "../LoginModal";
// import Currency from "./Currency";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import ConfirmBooking from "../ConfirmBooking";
import { Dict } from "@/types";
import Profile from "./Profile";
import { Locale } from "@/i18n-config";
import BurgerMenu from "../BurgerMenu";

function Header({ lang, dict }: { lang: Locale; dict: Dict }) {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("?login=true", { scroll: false });
  };

  const handleGuide = () => {
    router.replace("?login=guide", { scroll: false });
  };
  const user = useStore((state) => state.user);
  const searchParams = useSearchParams();
  const modalVisible = searchParams.get("login");
  const confirmModal = searchParams.get("confirm-modal");
  const [burgerOpen, setBurgerOpen] = useState(false);

  const burgerClick = () => {
    setBurgerOpen(!burgerOpen);
    if (burgerOpen) {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "";
    } else {
      document.documentElement.style.overflow = "hidden"; // html
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div className={classes.leftSide}>
            <Link
              href={
                user && user.user.type == "partner"
                  ? "/" + lang + "/profile"
                  : "/" + lang + "/"
              }
              className={classes.logo}
            >
              <Image
                src={"/images/logo.svg"}
                alt="logo"
                width={98}
                height={22}
              />
            </Link>
            {/* {(user && user.user.type == "customer") || !user ? (
              <>
                <Search dict={dict} />
              </>
            ) : null} */}
          </div>
          {/* <div className={classes.center}>
            {(user && user.user.type == "customer") || !user ? (
              <>
                <LangBtn lang={lang} />
                <Currency />
                <Link href={"/" + lang + "/tours/"} className={classes.links}>
                  {dict["header.excursions"]}
                </Link>
                <Link href={"/" + lang + "/transfer"} className={classes.links}>
                  {dict["header.order_transfer"]}
                </Link>
              </>
            ) : null}
          </div> */}
          <div className={classes.leftSide}>
            <div className={classes.center}>
              {(user && user.user.type == "customer") || !user ? (
                <>
                  <LangBtn lang={lang} />
                  {/* <Currency /> */}
                  <Link href={"/" + lang + "/tours/"} className={classes.links}>
                    {dict["header.excursions"]}
                  </Link>
                  <Link
                    href={"/" + lang + "/transfer"}
                    className={classes.links}
                  >
                    {dict["header.order_transfer"]}
                  </Link>
                </>
              ) : null}
            </div>

            {!user && user !== 0 ? (
              <>
                <div
                  onClick={handleGuide}
                  className={`${classes.secondaryBtn} ${classes.btnGuide}`}
                >
                  <p className={classes.secondaryBtnText}>
                    {dict["header.become_guide"]}
                  </p>
                </div>
                <div onClick={handleLogin} className={classes.mainBtn}>
                  <p className={classes.mainBtnText}>{dict["header.login"]}</p>
                </div>
              </>
            ) : (
              user !== 0 && <Profile lang={lang} dict={dict} user={user} />
            )}

            <div onClick={burgerClick} className={classes.burger}>
              {burgerOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 5L15 15"
                    stroke="#BBBBBB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 15L15 5"
                    stroke="#BBBBBB"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.5 0.833333C0.5 0.373096 0.947715 0 1.5 0H16.5C17.0523 0 17.5 0.373096 17.5 0.833333C17.5 1.29357 17.0523 1.66667 16.5 1.66667H1.5C0.947715 1.66667 0.5 1.29357 0.5 0.833333Z"
                    fill="#242D3F"
                  />
                  <path
                    d="M0.5 5C0.5 4.53976 0.947715 4.16667 1.5 4.16667H16.5C17.0523 4.16667 17.5 4.53976 17.5 5C17.5 5.46024 17.0523 5.83333 16.5 5.83333H1.5C0.947715 5.83333 0.5 5.46024 0.5 5Z"
                    fill="#242D3F"
                  />
                  <path
                    d="M0.5 9.16667C0.5 8.70643 0.947715 8.33333 1.5 8.33333H16.5C17.0523 8.33333 17.5 8.70643 17.5 9.16667C17.5 9.6269 17.0523 10 16.5 10H1.5C0.947715 10 0.5 9.6269 0.5 9.16667Z"
                    fill="#242D3F"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
      <Suspense>
        {modalVisible && <LoginModal lang={lang} dict={dict} router={router} />}
        {confirmModal && <ConfirmBooking dict={dict} router={router} />}
      </Suspense>

      <BurgerMenu
        setBurgerOpen={burgerClick}
        user={user}
        dict={dict}
        lang={lang}
        burgerOpen={burgerOpen}
      />
    </>
  );
}

export default Header;
