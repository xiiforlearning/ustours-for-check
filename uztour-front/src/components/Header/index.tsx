"use client";
import useStore from "@/store/useStore";
import Search from "../Search";
import classes from "./Header.module.css";
import LangBtn from "./LangBtn";
import Image from "next/image";
import LoginModal from "../LoginModal";
import Currency from "./Currency";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import ConfirmBooking from "../ConfirmBooking";
import { Dict } from "@/types";
import Profile from "./Profile";

function Header({ lang, dict }: { lang: string; dict: Dict }) {
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

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <div className={classes.leftSide}>
            <Link href="/" className={classes.logo}>
              <Image
                src={"/images/logo.svg"}
                alt="logo"
                width={98}
                height={22}
              />
            </Link>
            <Search />
          </div>
          <div className={classes.center}>
            <LangBtn lang={lang} />
            <Currency />
            <Link href={"/tours"} className={classes.links}>
              Экскурсии
            </Link>
            <Link href={"/transfer"} className={classes.links}>
              Заказать трансфер
            </Link>
            {/* <div className={classes.links}>Помощь</div> */}
          </div>
          <div className={classes.leftSide}>
            {!user && user !== 0 ? (
              <>
                <div onClick={handleGuide} className={classes.secondaryBtn}>
                  <p className={classes.secondaryBtnText}>Стать гидом</p>
                </div>
                <div onClick={handleLogin} className={classes.mainBtn}>
                  <p className={classes.mainBtnText}>Войти</p>
                </div>
              </>
            ) : (
              user !== 0 && <Profile user={user} />
            )}
          </div>
        </div>
      </div>
      <Suspense>
        {modalVisible && <LoginModal router={router} />}
        {confirmModal && <ConfirmBooking router={router} />}
      </Suspense>
    </>
  );
}

export default Header;
