"use client";

import { API } from "@/http-client";
import useStore from "@/store/useStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function InitialLogic() {
  const setUser = useStore((state) => state.setUser);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.access_token) {
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedUser.access_token}`;
      }
      setUser(parsedUser);
    } else {
      setUser(null);
    }
  }, [setUser, pathname, router]);
  return null;
}

export default InitialLogic;
