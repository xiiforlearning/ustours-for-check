import { Suspense } from "react";
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import Booking from "@/components/BookingPage";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Page(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  return (
    <Suspense>
      <Booking lang={params.lang} dict={dict} />
    </Suspense>
  );
}

export default Page;
