import { useState, useEffect } from "react";

const getBreakpoint = (width) => ({
  isMobile:  width < 768,
  isTablet:  width >= 768 && width < 1024,
  isDesktop: width >= 1024,
  width,
});

const useBreakpoint = () => {
  const [bp, setBp] = useState(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return bp;
};

export default useBreakpoint;