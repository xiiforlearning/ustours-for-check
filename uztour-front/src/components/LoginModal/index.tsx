"use client";
import classes from "./LoginModal.module.css";
import { useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import Login from "./Login";
import Comfirmation from "./Comfirmation";
import GuideForm from "./GuideForm";
import { Dict, GuideSubmitData } from "@/types";
import { authUser, completeGuideData, verifyCode, verifyPhone } from "@/api";
import axios, { AxiosError } from "axios";
import useStore from "@/store/useStore";
import { Locale } from "@/i18n-config";
import { API } from "@/http-client";

function LoginModal({
  router,
  dict,
  lang,
}: {
  router: AppRouterInstance;
  dict: Dict;
  lang: Locale;
}) {
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
      setError(dict["guideform.empty_email"]);
      return;
    }
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      setError(dict["guideform.right_email"]);
      return;
    }
    setLoading(true);
    try {
      const res = await authUser({ email, isGuide, lang });
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
      setError(dict["guideform.invalid_code"]);
      return;
    }
    setLoading(true);
    try {
      const res = await verifyCode({ email, code: otp, isGuide });
      if ("access_token" in res) {
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.access_token}`;
        setUser(res);
        setError("");
        localStorage.setItem("user", JSON.stringify(res));
        closeModal();
        if (isGuide == 1) {
          openProfilePage();
        } else {
          redirect();
        }
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
      setError(dict["guideform.invalid_code"]);
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
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.access_token}`;
        setUser(data);
        setError("");
        localStorage.setItem("user", JSON.stringify(data));
        closeModal();
        openProfilePage();
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
    await authUser({ email, isGuide, lang });
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
        // setPageType("comfirmationGuidePhone");
        // setError("");
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message);
      }
    } finally {
      await submitGuidePhone({ otp: "1111" });
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
  const openProfilePage = () => {
    router.replace(`/${lang}/profile`);
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
              {pageType == "login" && dict["login.authentication"]}
              {pageType == "comfirmation" && dict.confirmation}
              {pageType == "guideForm" && dict["registerAsGuide"]}
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
              dict={dict}
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
              dict={dict}
              error={error}
              loading={loading}
            />
          )}
          {pageType === "guideForm" && (
            <GuideForm
              formData={formData}
              dict={dict}
              setFormData={setFormData}
              submitGuideData={submitGuideData}
              email={email}
              loading={loading}
            />
          )}
          {pageType === "comfirmationGuidePhone" && (
            <Comfirmation
              resendCode={resendGuideCode}
              dict={dict}
              loading={loading}
              title={dict["codeSentToPhone"]}
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
