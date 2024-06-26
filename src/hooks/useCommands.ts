import { useEffect, useState } from "react";
import { CommandClient } from "../models/command";

const useCommands = () => {
  const [commands, setCommands] = useState<CommandClient[]>([]);

  const onGetCommands = (commands: CommandClient[]) => {
    if (commands.length <= 0) {
      commands.unshift({
        hotKey: "",
        index: -1,
        displayName:
          "Your hot-keys.json was either not found, empty, or failed to parse",
      });
    }

    setCommands(commands);
  };

  useEffect(() => {
    window.electronAPI.listenForCommands(onGetCommands);
    window.electronAPI.readyForCommands();
  }, []);

  return commands;
};

export default useCommands;
