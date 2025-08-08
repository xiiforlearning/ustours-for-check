import Transfer from "../../components/Transfer";

import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import ExcursionClient from "@/components/ExcursionClient";
import classes from "./page.module.css";
import { getTours } from "@/api";
import Head from "next/head";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>;
}): Promise<Metadata> {
  const fetchedParam = await params;
  const dict = await getDictionary(fetchedParam.lang);

  return {
    title: dict.seoTitle,
    description: dict.seoDesc,
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Home(props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const res = await getTours({
    sortOrder: "ASC",
  });

  return (
    <>
      <Head>
        <title>{dict.seoTitle}</title>
        <meta name="description" content={dict.seoDesc} />
      </Head>
      <div className={classes.wrapper}>
        <Transfer dict={dict} />
        <ExcursionClient res={res} dict={dict} lang={params.lang} />
      </div>
    </>
  );
}

export default Home;
