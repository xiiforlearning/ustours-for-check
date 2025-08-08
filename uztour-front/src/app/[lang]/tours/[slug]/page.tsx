import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import TourDetail from "@/components/TourDetail";
import { getExactTours } from "@/api";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>;
}): Promise<Metadata> {
  const fetchedParam = await params;
  const slug = fetchedParam.slug;

  // fetch post information
  const res = await getExactTours({ id: slug });

  return {
    title: res.title,
    description: res.description,
  };
}

export default async function Tour({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>;
}) {
  const fetchedParam = await params;
  const slug = fetchedParam.slug;
  const dict = await getDictionary(fetchedParam.lang);
  const res = await getExactTours({ id: slug });

  console.log(res);

  return (
    <>
      <TourDetail dict={dict} lang={fetchedParam.lang} res={res} />;
    </>
  );
}
