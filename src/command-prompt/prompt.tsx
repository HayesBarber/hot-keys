import { CommandClient } from "../lib/command";
import { useState, useEffect, useRef } from "react";
import useEscapeKey from "../lib/useEscapeKey";
import useFocus from "../lib/useFocus";
import { modifierKeyMap } from "../lib/modifierKeyMap";

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
  const [commands, setCommands] = useState<CommandClient[]>([]);
  const inputRef = useFocus();
  useEscapeKey(() => window.electronAPI.hide());

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

  const onCommandSelected = (command: CommandClient) => {
    window.electronAPI.commandSelected(command);
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.target.select();
  }

  return (
    <CommandComponent className="rounded-xl border outline-none focus:outline-none">
      <CommandInput ref={inputRef} onFocus={onFocus} placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Hot-Keys">
          {commands.length ? commands.map((command) => <Item command={command} onSelect={onCommandSelected} />) : <div />}
        </CommandGroup>
      </CommandList>
    </CommandComponent>
  );
}

const Item: React.FC<{ command: CommandClient, onSelect: (hotKey: CommandClient) => void }> = ({ command, onSelect }) => {
  const parts: string[] = command.hotKey.split(' ');
  parts.forEach((part, index, arr) => {
    arr[index] = modifierKeyMap[part] ?? part;
  });

  return (
    <CommandItem onSelect={() => onSelect(command)}>
      <span>{command.displayName}</span>
      {parts.length ? <CommandShortcut>{parts.join('')}</CommandShortcut> : <div />}
    </CommandItem>
  );
}

export default App;
