import { MAX_DEVICE_WIDTH } from "@/constants/windowSizes";
import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobile = windowSize <= MAX_DEVICE_WIDTH.MOBILE;
  const isTablet = windowSize <= MAX_DEVICE_WIDTH.TABLET;
  const isDesktop = windowSize <= MAX_DEVICE_WIDTH.TABLET;

  return { windowSize, isDesktop, isMobile, isTablet };
};
