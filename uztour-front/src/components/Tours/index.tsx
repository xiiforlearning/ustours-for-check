"use client";
import classes from "./tours.module.css";
import Link from "next/link";
import Filter from "../Filter";
import ExcursionList from "../ExcursionList";
import { Dict, ResponseTour } from "@/types";
import { Locale } from "@/i18n-config";

function Tours({
  dict,
  lang,
  res,
  page,
  searchParams,
}: {
  dict: Dict;
  lang: Locale;
  res: { tours: ResponseTour[]; total: number; totalPages: number };
  page: number;
  searchParams: { [key: string]: string };
}) {
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
          <p className={classes.count}>
            {res.total} {dict["offers"]}
          </p>
          <Filter dict={dict} />
        </div>
      </div>

      <ExcursionList
        isPagination
        title={dict["popularExcursions"]}
        data={res.tours}
        dict={dict}
        lang={lang}
        currentPage={page}
        totalPages={res.totalPages}
        searchParams={searchParams}
      />
    </div>
  );
}

export default Tours;
