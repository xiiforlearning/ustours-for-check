import { Dict, ResponseTour } from "@/types";
import classes from "./BookingTourInfo.module.css";
function BookingTourInfo({
  currentExcursion,
  dict,
}: {
  currentExcursion: ResponseTour;
  dict: Dict;
}) {
  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <img className={classes.image} src={currentExcursion.main_photo} />
        <div className={classes.topInfo}>
          {currentExcursion.rating && (
            <div className={classes.ratingContent}>
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
                <p className={classes.rating}>{currentExcursion.rating}</p>
              </div>
              <div className={classes.dott}></div>
              <p className={classes.rating}>
                {currentExcursion.rating_count} {dict["marks"]}
              </p>
            </div>
          )}
          <p className={classes.title}>{currentExcursion.title}</p>
          <div className={classes.features}>
            <div className={classes.feature}>
              <svg
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.49878 2.01172C4.06128 2.01172 1.24878 4.82422 1.24878 8.26172C1.24878 11.6992 4.06128 14.5117 7.49878 14.5117C10.9363 14.5117 13.7488 11.6992 13.7488 8.26172C13.7488 4.82422 10.9363 2.01172 7.49878 2.01172ZM10.1863 10.2617L6.87378 8.44922V5.13672H7.81128V7.88672L10.6238 9.44922L10.1863 10.2617Z"
                  fill="#848484"
                />
              </svg>
              <p className={classes.featureText}>
                {currentExcursion.duration}{" "}
                {currentExcursion.duration_unit == "days"
                  ? dict.day
                  : dict.hour}
              </p>
            </div>
            <div className={classes.feature}>
              <svg
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.125 5.50977V11.3105C13.125 11.7682 12.8934 12.1871 12.5156 12.4191V13.4053C12.5156 13.6695 12.3085 13.8887 12.0586 13.8887H11.7539C11.5041 13.8887 11.2969 13.6695 11.2969 13.4053V12.5996H7.03143V13.4053C7.03143 13.6695 6.82425 13.8887 6.57442 13.8887H6.26974C6.0199 13.8887 5.81272 13.6695 5.81272 13.4053V12.4191C5.44101 12.1871 5.20336 11.7682 5.20336 11.3105V5.50977C5.20336 3.57617 7.03143 3.57617 9.16418 3.57617C11.2969 3.57617 13.125 3.57617 13.125 5.50977ZM7.64079 10.666C7.64079 10.3115 7.36658 10.0215 7.03143 10.0215C6.69629 10.0215 6.42208 10.3115 6.42208 10.666C6.42208 11.0205 6.69629 11.3105 7.03143 11.3105C7.36658 11.3105 7.64079 11.0205 7.64079 10.666ZM11.9063 10.666C11.9063 10.3115 11.6321 10.0215 11.2969 10.0215C10.9618 10.0215 10.6876 10.3115 10.6876 10.666C10.6876 11.0205 10.9618 11.3105 11.2969 11.3105C11.6321 11.3105 11.9063 11.0205 11.9063 10.666ZM11.9063 5.50977H6.42208V8.08789H11.9063V5.50977ZM3.98465 7.12109C3.96637 6.23164 3.2717 5.50977 2.43079 5.54199C1.58988 5.56133 0.919585 6.29609 0.937865 7.18555C0.956146 7.93965 1.46191 8.58418 2.15658 8.73242V13.8887H2.76594V8.73242C3.48498 8.57773 3.98465 7.90098 3.98465 7.12109Z"
                  fill="#848484"
                />
              </svg>

              <p className={classes.featureText}>
                {
                  // @ts-expect-error aaa
                  dict[currentExcursion.departure_city]
                }
              </p>
            </div>
            <div className={classes.feature}>
              <svg
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.62622 3.88672C6.28926 3.88672 6.92515 4.15011 7.39399 4.61895C7.86283 5.08779 8.12622 5.72368 8.12622 6.38672C8.12622 7.04976 7.86283 7.68565 7.39399 8.15449C6.92515 8.62333 6.28926 8.88672 5.62622 8.88672C4.96318 8.88672 4.32729 8.62333 3.85845 8.15449C3.38961 7.68565 3.12622 7.04976 3.12622 6.38672C3.12622 5.72368 3.38961 5.08779 3.85845 4.61895C4.32729 4.15011 4.96318 3.88672 5.62622 3.88672ZM5.62622 10.1367C7.29497 10.1367 10.6262 10.9742 10.6262 12.6367V13.8867H0.626221V12.6367C0.626221 10.9742 3.95747 10.1367 5.62622 10.1367ZM10.4762 4.11172C11.7387 5.48672 11.7387 7.39297 10.4762 8.65547L9.42622 7.59922C9.95122 6.86172 9.95122 5.90547 9.42622 5.16797L10.4762 4.11172ZM12.545 2.01172C15.0012 4.54297 14.9825 8.33047 12.545 10.7617L11.5262 9.74297C13.2575 7.75547 13.2575 4.91797 11.5262 3.03047L12.545 2.01172Z"
                  fill="#848484"
                />
              </svg>

              <p className={classes.featureText}>{dict["guide"]}: Абдулазиз</p>
            </div>
            <div className={classes.feature}>
              <svg
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.52486 9.6657L6.90128 8.13617L6.92045 8.11789C8.03267 6.9357 8.82528 5.5768 9.2919 4.13867H11.1648V2.91992H6.69034V1.70117H5.41193V2.91992H0.9375V4.13867H8.07741C7.64915 5.30867 6.97159 6.42383 6.05114 7.39883C5.45668 6.77117 4.96449 6.08258 4.57457 5.35742H3.29616C3.76278 6.3507 4.40199 7.28914 5.20099 8.13617L1.94744 11.1952L2.85511 12.0605L6.05114 9.01367L8.03906 10.9088L8.52486 9.6657ZM12.1236 6.57617H10.8452L7.96875 13.8887H9.24716L9.96307 12.0605H12.9993L13.7216 13.8887H15L12.1236 6.57617ZM10.4489 10.8418L11.4844 8.2032L12.5199 10.8418H10.4489Z"
                  fill="#848484"
                />
              </svg>

              <p className={classes.featureText}>
                {currentExcursion.languages
                  ?.map((item, index) =>
                    //@ts-expect-error aaa
                    index == 0 ? dict[item] : dict[item].toLocaleLowerCase()
                  )
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingTourInfo;
