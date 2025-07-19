import useStore from "@/store/useStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { excursions as localExcursions } from "@/consts";
import { getTours } from "@/api";

const ITEMS_PER_PAGE = 9;

function useTours() {
  const router = useRouter();
  const isProduction = useStore((state) => state.isProduction);
  const searchParams = useSearchParams();
  const pageQuery = searchParams.get("page");

  const [excursions, setExcursions] = useState(localExcursions);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(localExcursions.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (typeof pageQuery === "string") {
      const pageNum = parseInt(pageQuery);
      if (!isNaN(pageNum)) {
        setCurrentPage(Math.max(1, pageNum));
      }
    }
  }, [pageQuery]);

  useEffect(() => {
    if (isProduction) {
      const fetchData = async () => {
        try {
          const res = await getTours({
            limit: ITEMS_PER_PAGE,
            page: currentPage,
          });
          const data = res.tours;

          setExcursions(data);
          setTotalPages(Math.ceil(res.total / ITEMS_PER_PAGE));
        } catch (err) {
          console.error("Error fetching excursions:", err);
        }
      };

      fetchData();
    } else {
      // Local development: static data
      setExcursions(localExcursions);
      setTotalPages(Math.ceil(localExcursions.length / ITEMS_PER_PAGE));
    }
  }, [isProduction, currentPage]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/tours/?${params.toString()}`, { scroll: false });
  };

  return {
    currentPage,
    currentItems: excursions,
    totalPages,
    handlePageChange,
  };
}

export default useTours;
