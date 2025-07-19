"use client";
import { Dict } from "@/types";
import MainSearch from "../MainSearch";
import styles from "./Transfer.module.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
function Transfer({ dict }: { dict: Dict }) {
  const router = useRouter();
  const setIsProduction = useStore((state) => state.setIsProduction);
  const pressCount = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.user.type == "partner") {
        router.push("/profile");
      }
    }
  }, [router]);

  const handlePress = () => {
    pressCount.current += 1;

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      pressCount.current = 0;
    }, 500); // reset if no press within 500ms

    if (pressCount.current === 3) {
      setIsProduction(true);
      pressCount.current = 0; // reset after triggering
    }
  };

  return (
    <div className={styles.imageBack}>
      <div className={styles.overlay}>
        <div>
          <h1 onClick={handlePress} className={styles.title}>
            {dict["transferTitle"]}
          </h1>
          <h2 className={styles.label}>{dict["allInOne"]}</h2>
          <MainSearch dict={dict} />
        </div>
      </div>
    </div>
  );
}

export default Transfer;
