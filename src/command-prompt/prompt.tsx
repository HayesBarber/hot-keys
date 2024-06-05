import useEscapeKey from "../hooks/useEscapeKey";
import { useState } from "react";
import Pasteboard from "./components/pasteboard";
import Commands from "./components/commands";

const Prompt: React.FC = () => {
  useEscapeKey(() => window.electronAPI.hide());
  const [showPasteboard, setShowPasteboard] = useState(false);

  return (
    <>
      {showPasteboard && <Pasteboard back={() => setShowPasteboard(false)} />}
      {!showPasteboard && <Commands showPasteboard={() => setShowPasteboard(true)} />}
    </>
  );
};

export { Prompt };
