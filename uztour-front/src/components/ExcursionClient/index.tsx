"use client";
import { Dict, ResponseTour } from "@/types";
import ExcursionList from "../ExcursionList";
import { excursions } from "@/consts";
import { Locale } from "@/i18n-config";
import { useEffect, useState } from "react";
import useStore from "@/store/useStore";
import { getTours } from "@/api";

function ExcursionClient({ dict, lang }: { dict: Dict; lang: Locale }) {
  const isProduction = useStore((state) => state.isProduction);
  const [data, setData] = useState<ResponseTour[]>([]);

  useEffect(() => {
    async function load() {
      if (isProduction) {
        const res = await getTours({});
        setData(res.tours);
      } else {
        setData(excursions.slice(0, 6));
      }
    }
    load();
  }, [isProduction, lang]);

  return (
    <>
      <ExcursionList
        dict={dict}
        lang={lang}
        title={dict["popularExcursions"]}
        data={data}
      />
    </>
  );
}

export default ExcursionClient;
