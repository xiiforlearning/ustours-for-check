"use client";
import { useEffect, useState } from "react";
import classes from "./GuideTours.module.css";
import Link from "next/link";
import { getTours, getUser } from "@/api";
import useStore from "@/store/useStore";
import { useRouter } from "next/navigation";
function GuideTours() {
  const user = useStore((state) => state.user);
  const [data, setData] = useState<
    { id: string; title: string; status: string }[]
  >([]);
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
            <div className={classes.editBtn}>
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

              <Link href={"/guide-tour-create"} className={classes.editText}>
                Добавить экскурсию
              </Link>
            </div>
          </div>
        </div>

        <div className={classes.list}>
          {data?.map((item, index) => (
            <div className={classes.item} key={item.id}>
              <p className={classes.index}>{index + 1}.</p>
              <p className={classes.title}>
                {item.title ? item.title : "Пусто"}
              </p>
              <p className={classes.status}>
                {item.status == "not_complete" && "Не завершена"}
                {item.status == "moderation" && "На модерации"}
              </p>
              <div className={classes.right}>
                {item.status == "not_complete" && (
                  <svg
                    width="25"
                    onClick={() => editTour(item.id)}
                    className={classes.iconBtn}
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.0909 7.03859C21.4809 6.64859 21.4809 5.99859 21.0909 5.62859L18.7509 3.28859C18.3809 2.89859 17.7309 2.89859 17.3409 3.28859L15.5009 5.11859L19.2509 8.86859L21.0909 7.03859ZM3.38086 17.2486V20.9986H7.13086L18.1909 9.92859L14.4409 6.17859L3.38086 17.2486Z"
                      fill="#328AEE"
                    />
                  </svg>
                )}
                {item.status == "not_complete" && (
                  <svg
                    width="25"
                    height="24"
                    onClick={() => deleteTour(item.id)}
                    className={classes.iconBtn}
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.3828 4H15.8828L14.8828 3H9.88281L8.88281 4H5.38281V6H19.3828V4ZM6.38281 19C6.38281 19.5304 6.59353 20.0391 6.9686 20.4142C7.34367 20.7893 7.85238 21 8.38281 21H16.3828C16.9132 21 17.422 20.7893 17.797 20.4142C18.1721 20.0391 18.3828 19.5304 18.3828 19V7H6.38281V19Z"
                      fill="#EB5757"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GuideTours;
