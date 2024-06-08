import useKey from "../hooks/useKey";
import Pasteboard from "./components/pasteboard";
import Commands from "./components/commands";
import useShowPasteboard from "..//hooks/useShowPasteboard";

const Prompt: React.FC = () => {
  useKey("Escape", () => window.electronAPI.hide());
  const { showPasteboard, setShowPasteboard } = useShowPasteboard();

  return (
    <>
      {showPasteboard && <Pasteboard back={() => setShowPasteboard(false)} />}
      {!showPasteboard && (
        <Commands showPasteboard={() => setShowPasteboard(true)} />
      )}
    </>
  );
};

export { Prompt };
