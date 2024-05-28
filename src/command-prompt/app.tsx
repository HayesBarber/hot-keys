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

  const onCommandSelected = (hotKey: string) => {
    window.electronAPI.commandSelected(hotKey);
  }

  return (
    <CommandComponent className="rounded-xl border">
      <CommandInput autoFocus={true} onFocus={(e) => e.target.select()} placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Hot-Keys">
          {commands.length ? commands.map((command) => <Item displayName={command.displayName} hotKey={command.hotKey} onSelect={onCommandSelected} />) : <div />}
        </CommandGroup>
      </CommandList>
    </CommandComponent>
  );
}

const Item: React.FC<{ displayName: string, hotKey: string, onSelect: (hotKey: string) => void }> = ({ displayName, hotKey, onSelect }) => {
  const parts = hotKey.split(' ');
  parts.forEach((part, index, arr) => {
    arr[index] = map[part] ?? part;
  });

  return (
    <CommandItem onSelect={() => onSelect(hotKey)}>
      <span>{displayName}</span>
      <CommandShortcut>{parts.join('')}</CommandShortcut>
    </CommandItem>
  );
}

export default App;
