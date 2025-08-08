"use client";
import { useEffect, useState } from "react";
import classes from "./GuideTours.module.css";
import Link from "next/link";
import { getTours, getUser } from "@/api";
import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
import Tour from "./Tour";
import { ResponseTour } from "@/types";
function GuideTours() {
  const user = useStore((state) => state.user);
  const [data, setData] = useState<ResponseTour[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.user.type == "partner") {
        const userData = await getUser();
        if (userData.partner.id) {
          const res = await getTours({ partner_id: userData.partner.id });
          setData(res.tours);
        }
      }
    };
    fetchData();
  }, [user]);

  const deleteTour = async (id: string) => {
    id;
  };
  const editTour = async (id: string) => {
    router.push("/guide-tour-create?id=" + id);
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.editBlock}>
          <div className={classes.left}>
            <Link href={"/guide-tour-create"} className={classes.editBtn}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.93947 13.5267V9.19266H3.60547V7.80666H7.93947V3.47266H9.32547V7.80666H13.6485V9.19266H9.32547V13.5267H7.93947Z"
                  fill="white"
                />
              </svg>

              <p className={classes.editText}>Добавить туры</p>
            </Link>
          </div>
        </div>

        <div className={classes.list}>
          {data?.map((item, index) => (
            <Tour
              deleteTour={deleteTour}
              item={item}
              index={index}
              key={item.id}
              editTour={editTour}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GuideTours;
