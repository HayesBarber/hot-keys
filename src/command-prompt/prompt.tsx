import useKey from "../hooks/useKey";
import Pasteboard from "./components/pasteboard";
import Commands from "./components/commands";
import useShowPasteboard from "..//hooks/useShowPasteboard";
import { GlobalProviderContext, GlobalState } from "../hooks/useGlobalState";
import usePredefinedAccelerators from "..//hooks/usePredefinedAccelerators";

const Prompt: React.FC = () => {
  useKey("Escape", () => window.electronAPI.hide());
  const { showPasteboard, setShowPasteboard } = useShowPasteboard();
  const predefinedAccelerators = usePredefinedAccelerators();

  const value: GlobalState = {
    showPasteboard,
    setShowPasteboard: (show) => setShowPasteboard(show),
    predefinedAccelerators,
  };

  return (
    <GlobalProviderContext.Provider value={value}>
      {showPasteboard && <Pasteboard />}
      {!showPasteboard && <Commands />}
    </GlobalProviderContext.Provider>
  );
};

export { Prompt };
