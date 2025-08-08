import { getTours } from "@/api";
import Tours from "@/components/Tours";
import { getDictionary } from "@/get-dictionary";
import { i18n, Locale } from "@/i18n-config";
import { Metadata } from "next";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

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

async function Page(props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const searchParams = await props.searchParams;

  const { page, city, date, type, price, languages, duration } = searchParams;
  const currentPage = page ?? 1;
  const listPrice = [
    { label: dict["price"] || "Price", value: "", min: 0, max: 0 },
    { label: "0 - 35 USD", value: "0-35", min: 0, max: 35 },
    { label: "35-70 USD", value: "35-70", min: 35, max: 70 },
    { label: "70-120 USD", value: "70-120", min: 70, max: 120 },
    { label: `${dict["from2"] || "From"} 120 USD`, value: "120+", min: 120 },
  ];

  const selectedPrice = listPrice.find((item) => item.value === price);

  let min = undefined;
  let max = undefined;
  if (duration) {
    if (duration.split("-").length > 1) {
      min = Number(duration.split("-")[0]);
      max = Number(duration.split("-")[1]);
    } else {
      const num = Number(duration);
      min = num * 24 - 12;
      max = num * 24 + 12;
    }
  }

  const res = await getTours({
    limit: 9,
    page: Number(currentPage),
    city: city || "",
    date: date?.split(".")?.reverse().join("-") || "",
    type: type || "",
    sortOrder: "ASC",
    minPrice: selectedPrice?.min,
    maxPrice: selectedPrice?.max,
    languages: languages ? languages : undefined,
    minDuration: min,
    maxDuration: max,
  });
  console.log(res);

  if (!searchParams.test) {
    res.tours = res.tours.filter((tour) => tour.title != "test");
  }
  // console.log(res.tours.map((i) => i.title));

  return (
    <>
      <Tours
        searchParams={searchParams}
        page={Number(currentPage)}
        res={res}
        dict={dict}
        lang={params.lang}
      />
    </>
  );
}

export default Page;
