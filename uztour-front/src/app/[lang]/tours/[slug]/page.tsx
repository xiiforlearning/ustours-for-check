import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import TourDetail from "@/components/TourDetail";

export default async function Tour({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>;
}) {
  const fetchedParam = await params;
  const slug = fetchedParam.slug;
  // const currentExcursion = excursions.find((excursion) => excursion.id == slug);
  // if (!currentExcursion) {
  //   return null;
  // }

  const dict = await getDictionary(fetchedParam.lang);

  return <TourDetail slug={slug} dict={dict} lang={fetchedParam.lang} />;
}
