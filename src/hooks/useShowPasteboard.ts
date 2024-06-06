import { useEffect, useState } from "react";

const useShowPasteboard = () => {
  const [showPasteboard, setShowPasteboard] = useState(false);

  useEffect(() => {
    window.electronAPI.showPasteboard(() => setShowPasteboard(true));
  }, []);

  return { showPasteboard, setShowPasteboard };
};

export default useShowPasteboard;
