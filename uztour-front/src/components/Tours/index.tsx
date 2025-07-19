"use client";
import useTours from "@/hooks/useTours";
import classes from "./tours.module.css";
import Link from "next/link";
import Filter from "../Filter";
import ExcursionList from "../ExcursionList";
import { Dict } from "@/types";
import { Locale } from "@/i18n-config";

function Tours({ dict, lang }: { dict: Dict; lang: Locale }) {
  const { currentPage, currentItems, handlePageChange, totalPages } =
    useTours();

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <div className={classes.header}>
            <Link href={"/" + lang + "/"} className={classes.headerText}>
              {dict["main"]}
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
            <p className={classes.headerTitle}>{dict["header.excursions"]}</p>
          </div>
          <p className={classes.title}>{dict["allExcursions"]}</p>
          <p className={classes.count}>809 {dict["offers"]}</p>
          <Filter dict={dict} />
        </div>
      </div>

      <ExcursionList
        isPagination
        title={dict["popularExcursions"]}
        data={currentItems}
        dict={dict}
        lang={lang}
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
}

export default Tours;
