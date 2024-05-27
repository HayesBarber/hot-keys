import Command from "../command";
import { useState, useEffect } from "react";

import {
    Command as CommandComponent,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
  } from "../components/command"

const App: React.FC = () => {
    const [commands, setCommands] = useState<Command[]>([]);

    useEffect(() => {
      const queryString = global.location.search;
      const urlParams = new URLSearchParams(queryString);
      const commandsParam = urlParams.get('commands');
  
      if (commandsParam) {
        try {
          const parsedCommands: Command[] = JSON.parse(decodeURIComponent(commandsParam));
          setCommands(parsedCommands);
        } catch (error) {
          console.error('Failed to parse commands parameter:', error);
        }
      }
    }, []);

    return (
        <CommandComponent className="rounded-lg border">
          <CommandInput autoFocus={true} placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Settings">
              <CommandItem>
                <span>{commands.length ? commands[0].displayName : ''}</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandComponent>
    );
}

export default App;
