import { useEffect } from "react";

const useTheme = () => {
  const onTheme = (theme: string) => {
    const themes = ["light", "dark"];

    if (!themes.includes(theme)) return;

    const root = window.document.documentElement;

    root.classList.remove(...themes);

    root.classList.add(theme);
  };

  useEffect(() => {
    window.electronAPI.listenForTheme(onTheme);
    window.electronAPI.readyForTheme();
  }, []);
};

export default useTheme;
