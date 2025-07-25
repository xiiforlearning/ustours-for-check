import Link from "next/link";
import classes from "./GuideCard.module.css";
import { Dict, ResponseTour } from "@/types";
import { Locale } from "@/i18n-config";
function GuideCard({
  dict,
  currentExcursion,
  lang,
}: {
  dict: Dict;
  currentExcursion: ResponseTour;
  lang: Locale;
}) {
  console.log(currentExcursion);
  return (
    <div className={classes.conatiner}>
      <div className={classes.top}>
        <div className={classes.guidePhotoBlock}>
          <img
            className={classes.guidePhoto}
            src={currentExcursion?.partner?.avatar || "/images/guide.png"}
          />
          <div className={classes.guideNameBlock}>
            <h2 className={classes.guideName}>
              {currentExcursion?.partner?.partnerType === "company"
                ? dict["company"]
                : dict["guide"]}
              :{" "}
              {currentExcursion?.partner?.partnerType === "company"
                ? dict["company"]
                : currentExcursion?.partner?.firstName || "Ислом"}
            </h2>
            {/* <div className={classes.ratingContent}>
              <div className={classes.ratingValue}>
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.64691 1.11299C7.93 0.451918 8.89415 0.451919 9.17723 1.113L10.848 5.01479C10.9674 5.29348 11.2372 5.4839 11.547 5.50802L15.8837 5.84573C16.6185 5.90295 16.9164 6.79359 16.3566 7.25938L13.0525 10.0085C12.8165 10.2049 12.7134 10.513 12.7855 10.8066L13.7949 14.9171C13.966 15.6135 13.186 16.164 12.5569 15.7908L8.84404 13.588C8.57884 13.4307 8.24531 13.4307 7.98011 13.588L4.26723 15.7908C3.63815 16.164 2.85814 15.6135 3.02917 14.9171L4.03864 10.8066C4.11075 10.513 4.00768 10.2049 3.77168 10.0085L0.467516 7.25938C-0.0923046 6.79359 0.205637 5.90295 0.940411 5.84573L5.27718 5.50802C5.58695 5.4839 5.85678 5.29348 5.97612 5.01479L7.64691 1.11299Z"
                    fill="#F4BC32"
                  />
                </svg>
                <p className={classes.rating}>{4.5}</p>
              </div>
              <div className={classes.dott}></div>
              <p className={classes.rating}>
                {15} {dict["marks"]}
              </p>
            </div> */}
          </div>
        </div>
        <div className={classes.features}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.09318 9.4955L7.36136 7.864L7.38182 7.8445C8.56818 6.5835 9.41364 5.134 9.91136 3.6H11.9091V2.3H7.13636V1H5.77273V2.3H1V3.6H8.61591C8.15909 4.848 7.43636 6.0375 6.45455 7.0775C5.82045 6.408 5.29545 5.6735 4.87955 4.9H3.51591C4.01364 5.9595 4.69545 6.9605 5.54773 7.864L2.07727 11.127L3.04545 12.05L6.45455 8.8L8.575 10.8215L9.09318 9.4955ZM12.9318 6.2H11.5682L8.5 14H9.86364L10.6273 12.05H13.8659L14.6364 14H16L12.9318 6.2ZM11.1455 10.75L12.25 7.9355L13.3545 10.75H11.1455Z"
              fill="black"
            />
          </svg>
          {currentExcursion?.partner ? (
            <p className={classes.featuresText}>
              {currentExcursion.partner.spokenLanguages
                .map((lang, index) =>
                  //@ts-expect-error aaa
                  index == 0 ? dict[lang] : dict[lang].toLocaleLowerCase()
                )
                .join(", ")}
            </p>
          ) : (
            <p className={classes.featuresText}>
              {dict["english"]}, {dict["russian"].toLocaleLowerCase()},{" "}
              {dict["chinese"].toLocaleLowerCase()}
            </p>
          )}
        </div>
        <div className={classes.features}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.00033 3.33203C6.70757 3.33203 7.38585 3.61298 7.88594 4.11308C8.38604 4.61318 8.66699 5.29145 8.66699 5.9987C8.66699 6.70594 8.38604 7.38422 7.88594 7.88432C7.38585 8.38441 6.70757 8.66536 6.00033 8.66536C5.29308 8.66536 4.6148 8.38441 4.11471 7.88432C3.61461 7.38422 3.33366 6.70594 3.33366 5.9987C3.33366 5.29145 3.61461 4.61318 4.11471 4.11308C4.6148 3.61298 5.29308 3.33203 6.00033 3.33203ZM6.00033 9.9987C7.78032 9.9987 11.3337 10.892 11.3337 12.6654V13.9987H0.666992V12.6654C0.666992 10.892 4.22033 9.9987 6.00033 9.9987ZM11.1737 3.57203C12.5203 5.0387 12.5203 7.07203 11.1737 8.4187L10.0537 7.29203C10.6137 6.50536 10.6137 5.48536 10.0537 4.6987L11.1737 3.57203ZM13.3803 1.33203C16.0003 4.03203 15.9803 8.07203 13.3803 10.6654L12.2937 9.5787C14.1403 7.4587 14.1403 4.43203 12.2937 2.4187L13.3803 1.33203Z"
              fill="black"
            />
          </svg>

          <p className={classes.featuresText}>
            {dict["workExperience"]}:{" "}
            {currentExcursion.partner.yearsOfExperience | 2}{" "}
            {lang == "ru" && currentExcursion.partner.yearsOfExperience == 1
              ? "год"
              : dict["year"]}
          </p>
        </div>

        <Link
          href={currentExcursion?.partner?.certificates[0] || "#"}
          target="_blank"
          className={classes.features}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 15.5833C5.5 13.75 9.16667 12.7417 11 12.7417C12.8333 12.7417 16.5 13.75 16.5 15.5833V16.5H5.5V15.5833ZM13.75 8.25C13.75 8.97935 13.4603 9.67882 12.9445 10.1945C12.4288 10.7103 11.7293 11 11 11C10.2707 11 9.57118 10.7103 9.05546 10.1945C8.53973 9.67882 8.25 8.97935 8.25 8.25C8.25 7.52065 8.53973 6.82118 9.05546 6.30546C9.57118 5.78973 10.2707 5.5 11 5.5C11.7293 5.5 12.4288 5.78973 12.9445 6.30546C13.4603 6.82118 13.75 7.52065 13.75 8.25ZM2.75 4.58333V17.4167C2.75 17.9029 2.94315 18.3692 3.28697 18.713C3.63079 19.0568 4.0971 19.25 4.58333 19.25H17.4167C17.9029 19.25 18.3692 19.0568 18.713 18.713C19.0568 18.3692 19.25 17.9029 19.25 17.4167V4.58333C19.25 4.0971 19.0568 3.63079 18.713 3.28697C18.3692 2.94315 17.9029 2.75 17.4167 2.75H4.58333C3.56583 2.75 2.75 3.575 2.75 4.58333Z"
              fill="#328AEE"
            />
          </svg>

          <p className={`${classes.featuresText} ${classes.link}`}>
            {dict["certifacatedGuide"]}
          </p>
        </Link>
      </div>
      <div className={classes.bottom}>
        <p className={classes.description}>
          {currentExcursion?.partner?.about || dict["guideDesc"]}
        </p>
        {/* <Link href={"#"} className={classes.secondatyBtn}>
          <p className={classes.secondatyBtnText}>Перейти в профиль гида</p>
        </Link> */}
      </div>
    </div>
  );
}

export default GuideCard;
