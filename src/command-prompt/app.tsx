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
          console.error('Failed to parse');
        }
      }
    }, []);

    return (
        <CommandComponent className="rounded-xl border">
          <CommandInput autoFocus={true} placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Hot-Keys">
              {commands.length ? commands.map((command) => <Item displayName={command.displayName} hotKey={command.hotKey} command={command.command}/>) : <div/>}
            </CommandGroup>
          </CommandList>
        </CommandComponent>
    );
}

const Item: React.FC<Command> = ({displayName, hotKey}) => {
  return (
    <CommandItem>
      <span>{displayName}</span>
      <CommandShortcut>{hotKey}</CommandShortcut>
    </CommandItem>
  );
}

export default App;
