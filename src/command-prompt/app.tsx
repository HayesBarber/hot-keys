import Command from "../command";
import { useState, useEffect, useCallback } from "react";
import useEscapeKey from "../lib/useEscapeKey";

import {
  Command as CommandComponent,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../components/command"

const map: Record<string, string> = {
  'Command': '⌘',
  'Option': '⌥',
  'Shift': '⇧',
  'Control': '⌃',
  'Caps Lock': '⇪',
};

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

  const handleEscape = () => {
    window.electronAPI.hide();
  };

  useEscapeKey(handleEscape);

  const onCommandSelected = (command: Command) => {
    window.electronAPI.commandSelected(command);
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.target.select();
  }

  return (
    <CommandComponent className="rounded-xl border">
      <CommandInput autoFocus={true} onFocus={onFocus} placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Hot-Keys">
          {commands.length ? commands.map((command) => <Item command={command} onSelect={onCommandSelected} />) : <div />}
        </CommandGroup>
      </CommandList>
    </CommandComponent>
  );
}

const Item: React.FC<{ command: Command, onSelect: (hotKey: Command) => void }> = ({ command, onSelect }) => {
  const parts = command.hotKey.split(' ');
  parts.forEach((part, index, arr) => {
    arr[index] = map[part] ?? part;
  });

  return (
    <CommandItem onSelect={() => onSelect(command)}>
      <span>{command.displayName}</span>
      <CommandShortcut>{parts.join('')}</CommandShortcut>
    </CommandItem>
  );
}

export default App;
