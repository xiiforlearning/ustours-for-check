import PrimaryBtn from "../ui/PrimaryBtn";
import classes from "./LoginModal.module.css";
import Image from "next/image";
function Login({
  email,
  setIsGuide,
  isGuide,
  handleChangeEmail,
  submit,
  error,
  loading,
}: {
  email: string;
  setIsGuide: (isGuide: number) => void;
  isGuide: number;
  handleChangeEmail: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submit: () => void;
  error: string;
  loading?: boolean;
}) {
  return (
    <>
      <div className={classes.tab}>
        <div
          style={{
            transform: isGuide == 1 ? `translateX(100%)` : "translateX(0%)",
          }}
          className={classes.back}
        ></div>
        <div
          onClick={() => setIsGuide(0)}
          style={{ color: isGuide === 0 ? "#328AEE" : "#BBBBBB" }}
          className={classes.tabText}
        >
          Я турист
        </div>
        <div
          style={{ color: isGuide === 1 ? "#328AEE" : "#BBBBBB" }}
          onClick={() => setIsGuide(1)}
          className={classes.tabText}
        >
          Я автор тура
        </div>
      </div>
      <div
        style={{ borderColor: error ? "#EB5757" : "#DDDDDD" }}
        className={classes.inputContainer}
      >
        <svg
          className={classes.emailIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.667 6.66732L10.0003 10.834L3.33366 6.66732V5.00065L10.0003 9.16732L16.667 5.00065V6.66732ZM16.667 3.33398H3.33366C2.40866 3.33398 1.66699 4.07565 1.66699 5.00065V15.0007C1.66699 15.4427 1.84259 15.8666 2.15515 16.1792C2.46771 16.4917 2.89163 16.6673 3.33366 16.6673H16.667C17.109 16.6673 17.5329 16.4917 17.8455 16.1792C18.1581 15.8666 18.3337 15.4427 18.3337 15.0007V5.00065C18.3337 4.07565 17.5837 3.33398 16.667 3.33398Z"
            fill="#848484"
          />
        </svg>

        <input
          alt="email"
          className={classes.input}
          type="email"
          value={email}
          onChange={handleChangeEmail}
          autoComplete="on"
          name="email"
          placeholder="Email"
        />
      </div>

      {error && (
        <div className={classes.errorBlock}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.7 8.7H7.3V4.5H8.7V8.7ZM8.7 11.5H7.3V10.1H8.7V11.5ZM8 1C7.08075 1 6.17049 1.18106 5.32122 1.53284C4.47194 1.88463 3.70026 2.40024 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85651 1.7375 11.637 3.05025 12.9497C3.70026 13.5998 4.47194 14.1154 5.32122 14.4672C6.17049 14.8189 7.08075 15 8 15C9.85651 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85651 15 8C15 7.08075 14.8189 6.17049 14.4672 5.32122C14.1154 4.47194 13.5998 3.70026 12.9497 3.05025C12.2997 2.40024 11.5281 1.88463 10.6788 1.53284C9.8295 1.18106 8.91925 1 8 1Z"
              fill="#EB5757"
            />
          </svg>
          <p className={classes.errorText}>{error}</p>
        </div>
      )}
      <PrimaryBtn loading={loading} text="Продолжить" onClick={submit} />

      <div className={classes.socials}>
        <div className={classes.line1}></div>
        <p className={classes.loginBySocial}>Или продолжить с помощью</p>
        <div className={classes.line1}></div>
      </div>
      <div className={classes.socialsContainer}>
        <div className={classes.socialsItem}>
          <Image
            alt="google"
            width={20}
            height={20}
            src={"/images/google.svg"}
          />
        </div>
        <div className={classes.socialsItem}>
          <Image alt="apple" width={20} height={20} src={"/images/apple.svg"} />
        </div>
      </div>

      <div className={classes.agreement}>
        <p className={classes.agreementText}>
          Нажимая “Продолжить”, вы соглашаетесь с условиями <br />
          <span className={classes.link}>
            публичной оферты и обработкой персональных данных
          </span>
        </p>
      </div>
    </>
  );
}

export default Login;
