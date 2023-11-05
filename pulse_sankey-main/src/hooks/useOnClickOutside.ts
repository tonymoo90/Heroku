import { useEffect } from "react";

const useOnClickOutside = (
  ref: Element | null = null,
  callback: (e: MouseEvent) => void,
): void => {
  useEffect(() => {
    if (!ref) return;
    const listener = (e: MouseEvent) => {
      if (ref.contains(e.target as Element)) {
        return;
      }
      callback(e);
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, [ref, callback]);
};

export default useOnClickOutside;
