import Transfer from "../../components/Transfer";

import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import ExcursionClient from "@/components/ExcursionClient";
import classes from "./page.module.css";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Home(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return (
    <div className={classes.wrapper}>
      <Transfer dict={dict} />
      <ExcursionClient dict={dict} lang={params.lang} />
    </div>
  );
}

export default Home;
