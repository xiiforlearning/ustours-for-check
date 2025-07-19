"use client";
import { API } from "@/http-client";
import { GuideDataType } from "@/types";
import { useEffect, useState } from "react";

function useGuide() {
  const [guide, setGuide] = useState<GuideDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    refetch();
  }, []);

  const refetch = () => {
    API.get<GuideDataType>("/users/profile")
      .then((response) => {
        setGuide(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching guide data:", error);
        setLoading(false);
      });
  };

  return { guide, loading, refetch };
}

export default useGuide;
