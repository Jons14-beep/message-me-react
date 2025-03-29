import { useEffect } from "react";

const useViewportHeight = () => {
  useEffect(() => {
    const setFullHeight = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`);
    };

    setFullHeight(); // Set on mount
    window.addEventListener("resize", setFullHeight);
    
    return () => window.removeEventListener("resize", setFullHeight);
  }, []);
};

export default useViewportHeight;
