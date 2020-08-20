import { useState, useEffect } from "react";

const ORIENTATION_MIN_BREAKPOINT = 1.2;

export default function useSize() {
  const [size, setSize] = useState({});

  function handleResize() {
    const { innerWidth, innerHeight } = window;

    let size = "xs";
    if (innerWidth >= 768 && innerWidth < 992) {
      size = "sm";
    } else if (innerWidth >= 992 && innerWidth < 1200) {
      size = "md";
    } else if (innerWidth >= 1200) {
      size = "lg";
    }
    let orientation = "none";
    if (innerWidth > innerHeight * ORIENTATION_MIN_BREAKPOINT) {
      orientation = "landscape";
    } else if (innerHeight > innerWidth * ORIENTATION_MIN_BREAKPOINT) {
      orientation = "portrait";
    }
    setSize({ width: innerWidth, height: innerHeight, size, orientation });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, true);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
