import { Suspense } from "react";
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import Booking from "@/components/BookingPage";
import { getExactTours } from "@/api";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Page(props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const searchParams = await props.searchParams;
  const date = searchParams.date;
  const adult = searchParams.adult;
  const child = searchParams.child;
  const email = searchParams.email;
  const phone = searchParams.phone;
  const telegram = searchParams.telegram;
  const name = searchParams.name;
  const whatsupp = searchParams.whatsupp;
  const id = searchParams.excursion_id;
  if (!id) return null;
  const res = await getExactTours({ id: id });
  if (!res) return null;

  return (
    <Suspense>
      <Booking
        date={date}
        adult={adult}
        child={child}
        email={email}
        phone={phone}
        telegram={telegram}
        name={name}
        whatsupp={whatsupp}
        lang={params.lang}
        dict={dict}
        currentExcursion={res}
      />
    </Suspense>
  );
}

export default Page;
