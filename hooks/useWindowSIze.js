import { useState, useEffect } from "react";

const useWindowSize = () => {
  // Store window width/height
  const [size, setSize] = useState({ width: null, height: null });

  useEffect(() => {
    // Update size state
    const handleSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleSize(); // Initialize values on mount

    window.addEventListener("resize", handleSize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  return size;
};

export default useWindowSize;
