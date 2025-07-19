import Tours from "@/components/Tours";
import { getDictionary } from "@/get-dictionary";
import { i18n, Locale } from "@/i18n-config";
import { Suspense } from "react";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Page(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  return (
    <Suspense>
      <Tours dict={dict} lang={params.lang} />
    </Suspense>
  );
}

export default Page;
