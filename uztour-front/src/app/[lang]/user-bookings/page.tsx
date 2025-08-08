import classes from "./userBookings.module.css";
import { i18n, Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
// import { getBooking } from "@/api";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

async function Page(props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);

  // const bookings = await getBooking();
  // console.log("Bookings:", bookings);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h1 className={classes.title}>{dict["myBookings"]}</h1>
      </div>
    </div>
  );
}

export default Page;
