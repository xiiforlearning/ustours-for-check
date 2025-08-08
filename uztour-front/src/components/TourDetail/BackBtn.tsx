"use client";
import { Dict } from "@/types";
import classes from "./TourDetail.module.css";
import { useRouter } from "next/navigation";
function BackBtn({ dict }: { dict: Dict }) {
  const router = useRouter();
  return (
    <div onClick={() => router.back()} className={classes.back}>
      <svg
        width="15"
        height="16"
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.63223 10.8625L6.76973 8L9.63223 5.13125L8.75098 4.25L5.00098 8L8.75098 11.75L9.63223 10.8625Z"
          fill="#242D3F"
        />
      </svg>
      <p className={classes.backText}>{dict["booking.back"]}</p>
    </div>
  );
}

export default BackBtn;
