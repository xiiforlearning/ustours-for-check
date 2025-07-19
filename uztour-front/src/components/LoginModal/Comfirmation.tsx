import OTPInput from "react-otp-input";
import classes from "./LoginModal.module.css";
import { useEffect, useRef, useState } from "react";
import PrimaryBtn from "../ui/PrimaryBtn";
import { Dict } from "@/types";
function Comfirmation({
  error,
  submitCode,
  resendCode,
  title,
  loading,
  dict,
}: {
  error: string;
  submitCode: ({ otp }: { otp: string }) => void;
  resendCode: () => void;
  title?: string;
  loading?: boolean;
  dict: Dict;
}) {
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(60);
  const timer = useRef<NodeJS.Timeout>(undefined);
  const startTimer = () => {
    clearInterval(timer.current);
    setTime(60);
    timer.current = setInterval(() => {
      setTime((prev) => {
        if (prev - 1 === 0) {
          clearInterval(timer.current);
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return (
    <>
      <p className={classes.comfirmationText}>
        {title ? title : <>{dict["confirmation.code_sent"]}</>}
      </p>

      <p className={classes.enterCode}>{dict["confirmation.enter_code"]}</p>
      <OTPInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        containerStyle={{
          justifyContent: "center",
          gap: "16px",
          marginTop: "10px",
        }}
        renderInput={(props) => (
          <input {...props} className={classes.otpInput} />
        )}
      />
      <div className={classes.errorCode}>
        {error && <p className={classes.errorText}>{error}</p>}
      </div>

      <PrimaryBtn
        loading={loading}
        onClick={() => submitCode({ otp })}
        text={dict["continue"]}
      />

      <div
        onClick={() => {
          if (time) return;
          startTimer();
          resendCode();
        }}
        style={{ backgroundColor: time ? "#F5F5F5" : "#E1EFFF" }}
        className={classes.timerBtn}
      >
        <h2
          style={{ color: time ? "#848484" : "#328AEE" }}
          className={classes.timerText}
        >
          {time ? (
            <>
              {" "}
              {dict["confirmation.resend_in"].replace(
                "{{time}}",
                time.toString()
              )}{" "}
            </>
          ) : (
            <> {dict["confirmation.resend"]} </>
          )}
        </h2>
      </div>
    </>
  );
}

export default Comfirmation;
