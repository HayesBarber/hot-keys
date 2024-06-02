import { useEffect, useState } from "react";
import { CommandClient } from "../models/command";

const useCommands = () => {
    const [commands, setCommands] = useState<CommandClient[]>([]);

    useEffect(() => {
        const queryString = global.location.search;
        const urlParams = new URLSearchParams(queryString);
        const commandsParam = urlParams.get('commands');

        if (commandsParam) {
            try {
                const parsedCommands: CommandClient[] = JSON.parse(decodeURIComponent(commandsParam));

                if (parsedCommands.length <= 2) {
                    parsedCommands.unshift({
                        hotKey: '',
                        index: -1,
                        displayName: 'Your commands.json was either not found, empty, or failed to parse',
                    });
                }

                setCommands(parsedCommands);
            } catch (error) {
                console.error('Failed to parse');
            }
        }
    }, []);

    return commands;
}

export default useCommands;
