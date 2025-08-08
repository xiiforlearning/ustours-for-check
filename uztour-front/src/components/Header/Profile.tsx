"use client";
import { Dict, UserType } from "@/types";
import classes from "./Header.module.css";
import { useEffect, useRef, useState } from "react";
import useStore from "@/store/useStore";
// import Link from "next/link";
import { Locale } from "@/i18n-config";
function Profile({
  user,
  dict,
  lang,
}: {
  user: UserType;
  dict: Dict;
  lang: Locale;
}) {
  const setUser = useStore((state) => state.setUser);
  const [open, setOpen] = useState(false); // 1️⃣  menu‑open state
  const wrapperRef = useRef<HTMLDivElement>(null); // for outside‑click close
  lang;

  // 2️⃣  close the menu when you click anywhere else
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const logout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("user");
    setUser(null);
  };

  const openModal = () => {
    if (user && user.user.type == "partner") {
      return;
    }
    setOpen((prev) => !prev);
  };

  return (
    <div onClick={openModal} ref={wrapperRef} className={classes.avatar}>
      <p className={classes.avatarText}>
        {user.user.email[0] + "" + user.user.email[1]}
      </p>
      {open && (
        <div className={classes.menu}>
          {/* <Link
            href={"/" + lang + "/user-bookings"}
            className={classes.menuItem}
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.46029 2.5C5.6813 2.5 5.89326 2.5878 6.04954 2.74408C6.20582 2.90036 6.29362 3.11232 6.29362 3.33333V4.06667C7.17695 3.7 8.37695 3.33333 9.62695 3.33333C12.127 3.33333 12.127 5 13.7936 5C16.2936 5 17.127 3.33333 17.127 3.33333V10C17.127 10 16.2936 11.6667 13.7936 11.6667C11.2936 11.6667 11.2936 10 9.62695 10C7.12695 10 6.29362 11.6667 6.29362 11.6667V17.5H4.62695V3.33333C4.62695 3.11232 4.71475 2.90036 4.87103 2.74408C5.02731 2.5878 5.23927 2.5 5.46029 2.5Z"
                fill="#848484"
              />
            </svg>
            <p className={classes.menuItemText}>{dict["yourTours"]}</p>
          </Link>
          <div className={classes.menuItemBorder}>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_814_58436)">
                <path
                  d="M16.2257 5.00841C16.059 4.51675 15.5923 4.16675 15.0423 4.16675H5.87565C5.32565 4.16675 4.86732 4.51675 4.69232 5.00841L2.95898 10.0001V16.6667C2.95898 17.1251 3.33398 17.5001 3.79232 17.5001H4.62565C5.08398 17.5001 5.45898 17.1251 5.45898 16.6667V15.8334H15.459V16.6667C15.459 17.1251 15.834 17.5001 16.2923 17.5001H17.1257C17.584 17.5001 17.959 17.1251 17.959 16.6667V10.0001L16.2257 5.00841ZM5.87565 13.3334C5.18398 13.3334 4.62565 12.7751 4.62565 12.0834C4.62565 11.3917 5.18398 10.8334 5.87565 10.8334C6.56732 10.8334 7.12565 11.3917 7.12565 12.0834C7.12565 12.7751 6.56732 13.3334 5.87565 13.3334ZM15.0423 13.3334C14.3507 13.3334 13.7923 12.7751 13.7923 12.0834C13.7923 11.3917 14.3507 10.8334 15.0423 10.8334C15.734 10.8334 16.2923 11.3917 16.2923 12.0834C16.2923 12.7751 15.734 13.3334 15.0423 13.3334ZM4.62565 9.16675L5.87565 5.41675H15.0423L16.2923 9.16675H4.62565Z"
                  fill="#848484"
                />
              </g>
              <defs>
                <clipPath id="clip0_814_58436">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(0.458984)"
                  />
                </clipPath>
              </defs>
            </svg>

            <p className={classes.menuItemText}>{dict["header.transfer"]}</p>
          </div> */}
          <div onClick={logout} className={classes.menuItem}>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.06282 2.36051C9.39877 2.25973 9.75363 2.23888 10.0991 2.29963C10.4445 2.36038 10.771 2.50104 11.0524 2.71039C11.3338 2.91974 11.5624 3.19197 11.7199 3.50537C11.8774 3.81876 11.9594 4.16464 11.9595 4.51538V15.484C11.9594 15.8347 11.8774 16.1806 11.7199 16.494C11.5624 16.8074 11.3338 17.0796 11.0524 17.289C10.771 17.4983 10.4445 17.639 10.0991 17.6997C9.75363 17.7605 9.39877 17.7396 9.06282 17.6388L4.56257 16.2888C4.09912 16.1497 3.69283 15.865 3.40397 15.4769C3.11511 15.0887 2.95906 14.6178 2.95898 14.1339V5.86545C2.95906 5.3816 3.11511 4.91066 3.40397 4.52249C3.69283 4.13433 4.09912 3.84961 4.56257 3.71058L9.06282 2.36051ZM12.7095 3.99935C12.7095 3.80043 12.7885 3.60965 12.9292 3.46899C13.0699 3.32833 13.2606 3.24931 13.4596 3.24931H15.7097C16.3064 3.24931 16.8788 3.48638 17.3008 3.90836C17.7227 4.33033 17.9598 4.90266 17.9598 5.49943V6.24947C17.9598 6.4484 17.8808 6.63917 17.7401 6.77983C17.5995 6.92049 17.4087 6.99951 17.2098 6.99951C17.0108 6.99951 16.8201 6.92049 16.6794 6.77983C16.5387 6.63917 16.4597 6.4484 16.4597 6.24947V5.49943C16.4597 5.30051 16.3807 5.10973 16.24 4.96907C16.0994 4.82841 15.9086 4.74939 15.7097 4.74939H13.4596C13.2606 4.74939 13.0699 4.67037 12.9292 4.52971C12.7885 4.38905 12.7095 4.19827 12.7095 3.99935ZM17.2098 12.9998C17.4087 12.9998 17.5995 13.0789 17.7401 13.2195C17.8808 13.3602 17.9598 13.551 17.9598 13.7499V14.4999C17.9598 15.0967 17.7227 15.669 17.3008 16.091C16.8788 16.513 16.3064 16.75 15.7097 16.75H13.4596C13.2606 16.75 13.0699 16.671 12.9292 16.5304C12.7885 16.3897 12.7095 16.1989 12.7095 16C12.7095 15.8011 12.7885 15.6103 12.9292 15.4696C13.0699 15.329 13.2606 15.25 13.4596 15.25H15.7097C15.9086 15.25 16.0994 15.1709 16.24 15.0303C16.3807 14.8896 16.4597 14.6988 16.4597 14.4999V13.7499C16.4597 13.551 16.5387 13.3602 16.6794 13.2195C16.8201 13.0789 17.0108 12.9998 17.2098 12.9998ZM8.20927 9.24964C8.01035 9.24964 7.81957 9.32866 7.67891 9.46932C7.53825 9.60998 7.45923 9.80075 7.45923 9.99968C7.45923 10.1986 7.53825 10.3894 7.67891 10.53C7.81957 10.6707 8.01035 10.7497 8.20927 10.7497H8.21002C8.40894 10.7497 8.59972 10.6707 8.74038 10.53C8.88104 10.3894 8.96006 10.1986 8.96006 9.99968C8.96006 9.80075 8.88104 9.60998 8.74038 9.46932C8.59972 9.32866 8.40894 9.24964 8.21002 9.24964H8.20927Z"
                fill="#EB5757"
              />
              <path
                d="M13.459 9.99862H17.2092M17.2092 9.99862L15.7091 8.49854M17.2092 9.99862L15.7091 11.4987"
                stroke="#EB5757"
                strokeWidth="1.8001"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p style={{ color: "#EB5757" }} className={classes.menuItemText}>
              {dict["header.logout"]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
