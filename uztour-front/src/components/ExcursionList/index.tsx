"use client";
import { ExcursionType } from "@/types";
import classes from "./ExcursionList.module.css";
import { Pagination } from "@mui/material";
import Link from "next/link";

function ExcursionList({
  title,
  data,
  isPagination,
  currentPage,
  setCurrentPage,
  totalPages,
}: {
  title: string;
  data: ExcursionType[];
  isPagination?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
}) {
  const onChange = (_: any, page: number) => {
    page && setCurrentPage && setCurrentPage(page);
  };
  return (
    <div className={classes.wrapper}>
      <h2 className={classes.title}>{title}</h2>
      <div className={classes.container}>
        {data.map((excursion) => (
          <div className={classes.item} key={excursion.image}>
            <div className={classes.top}>
              {excursion.isIndividual && (
                <div className={classes.individual}>
                  <svg
                    width="15"
                    height="16"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.88636 9.75781C8.17969 9.75781 4.77273 10.615 4.77273 12.3359V13.625H15V12.3359C15 10.615 11.593 9.75781 9.88636 9.75781ZM9.88636 8.46875C10.5645 8.46875 11.2148 8.19713 11.6943 7.71363C12.1738 7.23014 12.4432 6.57439 12.4432 5.89062C12.4432 5.20686 12.1738 4.55111 11.6943 4.06762C11.2148 3.58412 10.5645 3.3125 9.88636 3.3125C9.20825 3.3125 8.55792 3.58412 8.07842 4.06762C7.59892 4.55111 7.32955 5.20686 7.32955 5.89062C7.32955 6.57439 7.59892 7.23014 8.07842 7.71363C8.55792 8.19713 9.20825 8.46875 9.88636 8.46875ZM3.49432 9.29375L5.06037 10.2541L4.64489 8.44297L6.05114 7.23125L4.20384 7.07012L3.49432 5.36855L2.77202 7.07012L0.9375 7.23125L2.33097 8.44297L1.89631 10.2541L3.49432 9.29375Z"
                      fill="#242D3F"
                    />
                  </svg>
                  <p>Индивидуальная</p>
                </div>
              )}
              <img
                src={excursion.image}
                className={classes.img}
                alt={excursion.name}
              />
            </div>
            <div className={classes.bottom}>
              <div className={classes.info}>
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
                    <p className={classes.rating}>{excursion.rating}</p>
                  </div>
                  <div className={classes.dott}></div>
                  <p className={classes.rating}>
                    {excursion.ratingCount} оценки
                  </p>
                </div>
                <h1 className={classes.name}>{excursion.name}</h1>
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
                        d="M13.125 5.50977V11.3105C13.125 11.7682 12.8934 12.1871 12.5156 12.4191V13.4053C12.5156 13.6695 12.3085 13.8887 12.0586 13.8887H11.7539C11.5041 13.8887 11.2969 13.6695 11.2969 13.4053V12.5996H7.03143V13.4053C7.03143 13.6695 6.82425 13.8887 6.57442 13.8887H6.26974C6.0199 13.8887 5.81272 13.6695 5.81272 13.4053V12.4191C5.44101 12.1871 5.20336 11.7682 5.20336 11.3105V5.50977C5.20336 3.57617 7.03143 3.57617 9.16418 3.57617C11.2969 3.57617 13.125 3.57617 13.125 5.50977ZM7.64079 10.666C7.64079 10.3115 7.36658 10.0215 7.03143 10.0215C6.69629 10.0215 6.42208 10.3115 6.42208 10.666C6.42208 11.0205 6.69629 11.3105 7.03143 11.3105C7.36658 11.3105 7.64079 11.0205 7.64079 10.666ZM11.9063 10.666C11.9063 10.3115 11.6321 10.0215 11.2969 10.0215C10.9618 10.0215 10.6876 10.3115 10.6876 10.666C10.6876 11.0205 10.9618 11.3105 11.2969 11.3105C11.6321 11.3105 11.9063 11.0205 11.9063 10.666ZM11.9063 5.50977H6.42208V8.08789H11.9063V5.50977ZM3.98465 7.12109C3.96637 6.23164 3.2717 5.50977 2.43079 5.54199C1.58988 5.56133 0.919585 6.29609 0.937865 7.18555C0.956146 7.93965 1.46191 8.58418 2.15658 8.73242V13.8887H2.76594V8.73242C3.48498 8.57773 3.98465 7.90098 3.98465 7.12109Z"
                        fill="#848484"
                      />
                    </svg>
                    <p className={classes.featureText}>
                      {excursion.from == "tashkent"
                        ? "Из Ташкента"
                        : "Из Самарканда"}
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
                        d="M8.52486 9.6657L6.90128 8.13617L6.92045 8.11789C8.03267 6.9357 8.82528 5.5768 9.2919 4.13867H11.1648V2.91992H6.69034V1.70117H5.41193V2.91992H0.9375V4.13867H8.07741C7.64915 5.30867 6.97159 6.42383 6.05114 7.39883C5.45668 6.77117 4.96449 6.08258 4.57457 5.35742H3.29616C3.76278 6.3507 4.40199 7.28914 5.20099 8.13617L1.94744 11.1952L2.85511 12.0605L6.05114 9.01367L8.03906 10.9088L8.52486 9.6657ZM12.1236 6.57617H10.8452L7.96875 13.8887H9.24716L9.96307 12.0605H12.9993L13.7216 13.8887H15L12.1236 6.57617ZM10.4489 10.8418L11.4844 8.2032L12.5199 10.8418H10.4489Z"
                        fill="#848484"
                      />
                    </svg>

                    <p className={classes.featureText}>
                      Английский, русский, китайский
                    </p>
                  </div>
                </div>
              </div>

              <div className={classes.submitContent}>
                <div className={classes.priceContent}>
                  <div className={classes.priceLeft}>
                    <p className={classes.price}>{excursion.price} USD</p>
                    <p className={classes.priceText}>
                      {excursion.forPerson ? "за человека" : "за группу"}
                    </p>
                  </div>
                  <p className={classes.discountPrice}>
                    {excursion.priceWithoutDiscount} USD
                  </p>
                </div>
                <Link
                  href={`/tours/${excursion.id}`}
                  className={classes.submit}
                >
                  <p className={classes.submitText}>Подробнее</p>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isPagination && (
        <Link href="/tours" className={classes.more}>
          <p className={classes.moreText}>Все экскурсии</p>
        </Link>
      )}
      {isPagination && (
        <div className={classes.pagination}>
          <Pagination
            page={currentPage}
            onChange={onChange}
            color="primary"
            size="large"
            siblingCount={1}
            count={totalPages}
            variant="outlined"
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
}

export default ExcursionList;
