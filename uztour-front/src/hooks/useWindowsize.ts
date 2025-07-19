import { useState, useEffect } from "react";

const useScreenWidth = (): number => {
  const [screenWidth, setScreenWidth] = useState<number>(1000);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    setScreenWidth(window.innerWidth);

    // Set up event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this runs once on mount

  return screenWidth;
};

export default useScreenWidth;
