"use client";

import useStore from "@/store/useStore";
import { useEffect } from "react";

function InitialLogic() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    } else {
      setUser(null);
    }
  }, [setUser]);
  return null;
}

export default InitialLogic;
