"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import classes from "./ConfirmBooking.module.css";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import TextField from "../ui/TextField";
import Image from "next/image";
import PrimaryBtn from "../ui/PrimaryBtn";
import { Dict } from "@/types";
import useStore from "@/store/useStore";

function ConfirmBooking({
  router,
  dict,
}: {
  router: AppRouterInstance;
  dict: Dict;
}) {
  const user = useStore((state) => state.user);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    telegram: "",
    whatsupp: "",
    name: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.user.email,
        phone: "",
        telegram: "",
        whatsupp: "",
        name: "",
      });
    }
  }, [user]);

  // const closeModal = useCallback(() => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.delete("confirm-modal");
  //   router.replace(`?${params.toString()}`, { scroll: false });
  // }, [searchParams, router]);

  const handleClick = () => {
    if (formData.email) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("confirm-modal");
      router.replace(
        `?${params.toString()}&email=${formData.email}&phone=${
          formData.phone
        }&telegram=${formData.telegram}&whatsupp=${formData.whatsupp}&name=${
          formData.name
        }`,
        { scroll: false }
      );
    }
  };
  return (
    <>
      <div className={classes.overlay}>
        <div ref={modalRef} className={classes.modal}>
          <div className={classes.header}>
            <h2 className={classes.title}>{dict.bookingTitle}</h2>
          </div>
          <p className={classes.text}>{dict.fillContactDetails}</p>
          <TextField
            placeHolder=""
            label={dict.name}
            value={formData.name}
            setValue={(value: string) =>
              setFormData({ ...formData, name: value })
            }
          />
          <div style={{ height: 16 }} />
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
            label={dict.phoneNumber}
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
          <PrimaryBtn
            disabled={!formData.name}
            text={dict.continue}
            onClick={handleClick}
          />
        </div>
      </div>
    </>
  );
}

export default ConfirmBooking;
