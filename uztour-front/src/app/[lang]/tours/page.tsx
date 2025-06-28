"use client";
import Filter from "@/components/Filter";
import classes from "./tours.module.css";
import ExcursionList from "@/components/ExcursionList";
import useTours from "@/hooks/useTours";
import Link from "next/link";
import { Suspense } from "react";
function Tours() {
  const { currentPage, currentItems, handlePageChange, totalPages } =
    useTours();
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
          <p className={classes.headerTitle}>Экскурсии</p>
        </div>
        <p className={classes.title}>Все экскурсии</p>
        <p className={classes.count}>809 предложений</p>
        <Filter />
        <ExcursionList
          isPagination
          title="Популярные экскурсии"
          data={currentItems}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

function Page() {
  return (
    <Suspense>
      <Tours />
    </Suspense>
  );
}

export default Page;
