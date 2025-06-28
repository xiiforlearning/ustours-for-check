"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import classes from "./ConfirmBooking.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TextField from "../ui/TextField";
import Image from "next/image";
import PrimaryBtn from "../ui/PrimaryBtn";

function ConfirmBooking({ router }: { router: AppRouterInstance }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    telegram: "",
    whatsupp: "",
  });

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("confirm-modal");
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  const handleClick = () => {
    const params = searchParams.toString();
    router.push("/booking?" + params.replace("confirm-modal=true", ""));
  };
  return (
    <>
      <div className={classes.overlay}>
        <div ref={modalRef} className={classes.modal}>
          <div className={classes.header}>
            <div style={{ width: 24 }}></div>
            <h2 className={classes.title}>Бронирование экскурсии</h2>
            <div
              onClick={closeModal}
              style={{ cursor: "pointer" }}
              className={classes.side}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18"
                  stroke="#BBBBBB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 18L18 6"
                  stroke="#BBBBBB"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className={classes.text}>
            Пожалуйста, укажите свои контактные данные для связи по вашему
            бронированию
          </p>
          <TextField
            placeHolder=""
            label="Email*"
            value={formData.email}
            setValue={(value: string) =>
              setFormData({ ...formData, email: value })
            }
            svg={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6675 6.66536L10.0008 10.832L3.33415 6.66536V4.9987L10.0008 9.16536L16.6675 4.9987V6.66536ZM16.6675 3.33203H3.33415C2.40915 3.33203 1.66748 4.0737 1.66748 4.9987V14.9987C1.66748 15.4407 1.84308 15.8646 2.15564 16.1772C2.4682 16.4898 2.89212 16.6654 3.33415 16.6654H16.6675C17.1095 16.6654 17.5334 16.4898 17.846 16.1772C18.1586 15.8646 18.3341 15.4407 18.3341 14.9987V4.9987C18.3341 4.0737 17.5841 3.33203 16.6675 3.33203Z"
                  fill="#242D3F"
                />
              </svg>
            }
          />
          <div style={{ height: 16 }} />
          <TextField
            value={formData.phone}
            isPhone={true}
            label="Номер телефона"
            setValue={(value) => setFormData({ ...formData, phone: value })}
            placeHolder={"+998 __ ___ __ __"}
            svg={
              <Image alt="uz" width={17} height={13} src={"/images/uz.svg"} />
            }
          />
          <div style={{ height: 16 }} />
          <TextField
            value={formData.telegram}
            label="Telegram user"
            setValue={(value) => setFormData({ ...formData, telegram: value })}
            placeHolder={""}
          />
          <div style={{ height: 16 }} />
          <TextField
            value={formData.whatsupp}
            label="Whatsapp"
            setValue={(value) => setFormData({ ...formData, whatsupp: value })}
            placeHolder={""}
          />
          <div style={{ height: 16 }} />
          <PrimaryBtn text="Продолжить" onClick={handleClick} />
        </div>
      </div>
    </>
  );
}

export default ConfirmBooking;
