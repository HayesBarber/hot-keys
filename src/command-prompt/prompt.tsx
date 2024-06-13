import useKey from "../hooks/useKey";
import Pasteboard from "./components/pasteboard";
import Commands from "./components/commands";
import useShowPasteboard from "../hooks/useShowPasteboard";
import { GlobalProviderContext, GlobalState } from "../hooks/useGlobalState";
import usePredefinedAccelerators from "../hooks/usePredefinedAccelerators";
import useTheme from "../hooks/useTheme";
import useCommands from "../hooks/useCommands";
import usePasteboard from "../hooks/usePasteboard";

const Prompt: React.FC = () => {
  useTheme();
  useKey("Escape", () => window.electronAPI.hide());
  const { showPasteboard, setShowPasteboard } = useShowPasteboard();
  const predefinedAccelerators = usePredefinedAccelerators();
  const commands = useCommands();
  const pasteboard = usePasteboard();

  const value: GlobalState = {
    showPasteboard,
    setShowPasteboard: (show) => setShowPasteboard(show),
    predefinedAccelerators,
    commands,
    pasteboard,
  };

  return (
    <GlobalProviderContext.Provider value={value}>
      {showPasteboard && <Pasteboard />}
      {!showPasteboard && <Commands />}
    </GlobalProviderContext.Provider>
  );
};

export { Prompt };
