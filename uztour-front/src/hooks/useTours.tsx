import { excursions } from "@/consts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 9;

function useTours() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageQuery = searchParams.get("page");

  const totalPages = Math.ceil(excursions.length / ITEMS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof pageQuery === "string") {
      const pageNum = parseInt(pageQuery);
      if (!isNaN(pageNum)) {
        const validPage = Math.max(1, Math.min(pageNum, totalPages));
        setCurrentPage(validPage);
      }
    }
  }, [pageQuery, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = excursions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/tours/?${params.toString()}`, { scroll: false });
  };

  return { currentPage, currentItems, totalPages, handlePageChange };
}

export default useTours;
