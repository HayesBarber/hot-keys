import { useEffect, useState } from "react";
import { CommandClient } from "../models/command";

const useCommands = () => {
    const [commands, setCommands] = useState<CommandClient[]>([]);

    const onGetCommands = (commands: CommandClient[]) => {
        if (commands.length <= 2) {
            commands.unshift({
                hotKey: '',
                index: -1,
                displayName: 'Your commands.json was either not found, empty, or failed to parse',
            });
        }

        setCommands(commands);
    }

    useEffect(() => {
        window.electronAPI.getCommands(onGetCommands);
        window.electronAPI.ready();
    }, []);

    return commands;
}

export default useCommands;
