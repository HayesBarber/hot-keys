import { useCallback, useEffect } from 'react';

const useEscapeKey = (onEscape: () => void) => {
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onEscape();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", escFunction, false);

    return () => {
      window.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);
};

export default useEscapeKey;
