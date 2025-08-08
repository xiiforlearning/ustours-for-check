"use client";
import { Dict, ResponseTour } from "@/types";
import ExcursionList from "../ExcursionList";
import { Locale } from "@/i18n-config";

function ExcursionClient({
  dict,
  lang,
  res,
}: {
  dict: Dict;
  lang: Locale;
  res: { tours: ResponseTour[]; total: number };
}) {
  return (
    <ExcursionList
      dict={dict}
      lang={lang}
      currentPage={1}
      searchParams={{}}
      isPagination={false}
      totalPages={1}
      title={dict["popularExcursions"]}
      data={res.tours.slice(0, 6)}
    />
  );
}

export default ExcursionClient;
