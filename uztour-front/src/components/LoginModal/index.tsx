"use client";
import classes from "./LoginModal.module.css";
import { useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import Login from "./Login";
import Comfirmation from "./Comfirmation";
import GuideForm from "./GuideForm";
import { GuideSubmitData } from "@/types";
import { authUser, completeGuideData, verifyCode, verifyPhone } from "@/api";
import axios, { AxiosError } from "axios";
import useStore from "@/store/useStore";

function LoginModal({ router }: { router: AppRouterInstance }) {
  const searchParams = useSearchParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const setUser = useStore((state) => state.setUser);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const param = searchParams.get("login");
  const [loading, setLoading] = useState(false);
  const [pageType, setPageType] = useState<
    "login" | "comfirmation" | "guideForm" | "comfirmationGuidePhone"
  >("login");
  const [formData, setFormData] = useState<GuideSubmitData>({
    name: "",
    lastName: "",
    phone: "",
    isCompany: false,
    companyName: "",
  });
  const [isGuide, setIsGuide] = useState(param == "guide" ? 1 : 0);

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setEmail(event.target.value);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
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

  const submit = async () => {
    if (!email) {
      setError("Пожалуйста введите свой email");
      return;
    }
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      setError("Введите корректный email");
      return;
    }
    setLoading(true);
    try {
      const res = await authUser({ email, isGuide });
      setLoading(false);
      if (res.message == "Code sent to email") {
        setError("");
        setPageType("comfirmation");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async ({ otp }: { otp: string }) => {
    if (!otp && otp.length < 4) {
      setError("Введен неверный код, попробуйте снова");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyCode({ email, code: otp, isGuide });
      if ("access_token" in res) {
        setUser(res);
        setError("");
        localStorage.setItem("user", JSON.stringify(res));
        closeModal();
        redirect();
      }
      if ("status" in res && res.status == "need_profile_completion") {
        if (isGuide == 1) {
          setError("");
          setPageType("guideForm");
        }
      }
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitGuidePhone = async ({ otp }: { otp: string }) => {
    if (!otp && otp.length < 4) {
      setError("Введен неверный код, попробуйте снова");
      return;
    }
    setLoading(true);
    try {
      const data = await verifyPhone({
        phone: formData.phone,
        email,
        smsCode: otp,
      });
      if ("access_token" in data) {
        setUser(data);
        setError("");
        localStorage.setItem("user", JSON.stringify(data));
        closeModal();
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    setError("");
    await authUser({ email, isGuide });
    setLoading(false);
  };
  const resendGuideCode = () => {
    submitGuideData();
  };

  const submitGuideData = async () => {
    setLoading(true);
    try {
      const res = await completeGuideData({
        email,
        ...formData,
      });
      if (res.message == "Profile completed, SMS sent") {
        setPageType("comfirmationGuidePhone");
        setError("");
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const back = () => {
    if (pageType == "comfirmationGuidePhone") {
      setPageType("guideForm");
    }
    if (pageType == "guideForm") {
      setPageType("login");
    }
    if (pageType == "comfirmation") {
      setPageType("login");
    }
  };

  const redirect = () => {
    const excursion_id = searchParams.get("excursion_id");
    const date = searchParams.get("date");
    const adult = searchParams.get("adult");
    const child = searchParams.get("child");
    if (excursion_id && date && adult && child) {
      router.push(
        "?excursion_id=" +
          excursion_id +
          "&date=" +
          date +
          "&adult=" +
          adult +
          "&child=" +
          child +
          "&confirm-modal=true"
      );
    }
  };

  return (
    <div>
      <div className={classes.overlay}>
        <div
          ref={modalRef}
          className={`${classes.modal} ${
            pageType == "guideForm" && classes.guideFormModal
          }`}
        >
          <div className={classes.header}>
            <div
              style={{ cursor: pageType !== "login" ? "pointer" : "unset" }}
              onClick={back}
              className={classes.side}
            >
              {pageType !== "login" && (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="31"
                    height="31"
                    rx="7.5"
                    fill="white"
                  />
                  <rect
                    x="0.5"
                    y="0.5"
                    width="31"
                    height="31"
                    rx="7.5"
                    stroke="#DDDDDD"
                  />
                  <path
                    d="M18.843 19.8167L15.0263 16L18.843 12.175L17.668 11L12.668 16L17.668 21L18.843 19.8167Z"
                    fill="black"
                  />
                </svg>
              )}
            </div>
            <h2 className={classes.title}>
              {pageType == "login" && "Авторизация"}
              {pageType == "comfirmation" && "Подтверждение"}
              {pageType == "guideForm" && "Регистрация автора тура"}
            </h2>
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
          {pageType == "login" && (
            <Login
              handleChangeEmail={handleChangeEmail}
              setIsGuide={setIsGuide}
              isGuide={isGuide}
              email={email}
              error={error}
              submit={submit}
              loading={loading}
            />
          )}

          {pageType === "comfirmation" && (
            <Comfirmation
              resendCode={resendCode}
              submitCode={submitCode}
              error={error}
              loading={loading}
            />
          )}
          {pageType === "guideForm" && (
            <GuideForm
              formData={formData}
              setFormData={setFormData}
              submitGuideData={submitGuideData}
              email={email}
            />
          )}
          {pageType === "comfirmationGuidePhone" && (
            <Comfirmation
              resendCode={resendGuideCode}
              loading={loading}
              title={"Код отправлен на номер телефона"}
              submitCode={submitGuidePhone}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
