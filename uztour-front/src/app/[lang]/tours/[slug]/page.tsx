import Link from "next/link";
import classes from "./tour.module.css";
import { excursions } from "@/consts";
import Galery from "@/components/Galery";
import TourInfo from "@/components/TourInfo";
import GuideCard from "@/components/GuideCard";
import Detailed from "@/components/DetailedInfo";
import Booking from "@/components/Booking";

export default async function Tour({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const fetchedParam = await params;
  const slug = fetchedParam.slug;
  const currentExcursion = excursions.find(
    (excursion) => excursion.id == Number(slug)
  );
  if (!currentExcursion) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <Link href="/" className={classes.headerText}>
            Главная
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.72656 11.0533L8.7799 8L5.72656 4.94L6.66656 4L10.6666 8L6.66656 12L5.72656 11.0533Z"
              fill="#242D3F"
            />
          </svg>
          <Link href="/tours" className={classes.headerText}>
            Экскурсии
          </Link>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.72656 11.0533L8.7799 8L5.72656 4.94L6.66656 4L10.6666 8L6.66656 12L5.72656 11.0533Z"
              fill="#242D3F"
            />
          </svg>
          <p className={classes.headerTitle}>{currentExcursion.name}</p>
        </div>
        <Link href="/tours" className={classes.back}>
          <svg
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.63223 10.8625L6.76973 8L9.63223 5.13125L8.75098 4.25L5.00098 8L8.75098 11.75L9.63223 10.8625Z"
              fill="#242D3F"
            />
          </svg>
          <p className={classes.backText}>Назад</p>
        </Link>
        <h2 className={classes.title}>{currentExcursion.name}</h2>
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
            {currentExcursion.ratingCount} оценки
          </p>
        </div>
        <Galery
          mainImage={currentExcursion.image}
          images={currentExcursion.images}
        />
        <div className={classes.mainInfo}>
          <TourInfo />
          <GuideCard />
        </div>
        <div className={classes.additional}>
          <Detailed />
          <Booking currentExcursion={currentExcursion} />
        </div>
      </div>
    </div>
  );
}
