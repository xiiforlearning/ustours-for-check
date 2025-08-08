import Link from "next/link";
import classes from "./transfer.module.css";
import FilterTransfer from "@/components/FilterTransfer";
import TransportList from "@/components/TransportList";
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import { Suspense } from "react";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Page(props: {
  params: Promise<{ lang: Locale }>;
  searchParams?: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const searchParams = await props.searchParams;
  const { departure, date, time } = searchParams || {};

  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        <div className={classes.header}>
          <Link href={"/" + params.lang + "/"} className={classes.headerText}>
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
          <p className={classes.headerTitle}>{dict["transfer.catalog"]}</p>
        </div>
        <h2 className={classes.title}>{dict["transfer.choose_transport"]}</h2>
        <p className={classes.desc}>{dict["transfer.description"]}</p>
        <Suspense>
          <FilterTransfer dict={dict} />
          {departure && date && time && (
            <TransportList lang={params.lang} dict={dict} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default Page;
