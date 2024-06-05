import useEscapeKey from "../hooks/useEscapeKey";
import { useState } from "react";
import Pasteboard from "./pasteboard";
import Commands from "./commands";

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
