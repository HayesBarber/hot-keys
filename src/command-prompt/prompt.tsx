import { CommandClient } from "../models/command";
import useEscapeKey from "../hooks/useEscapeKey";
import useFocus from "../hooks/useFocus";
import useCommands from "../hooks/useCommands";
import { modifierKeyMap } from "../lib/modifierKeyMap";

import {
  Command as CommandComponent,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../components/command";

import { Button } from "../components/button";

const Prompt: React.FC = () => {
  const inputRef = useFocus();
  useEscapeKey(() => window.electronAPI.hide());
  const commands = useCommands();

  const onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.target.select();
  }

  const onCommandSelected = (command: CommandClient) => {
    window.electronAPI.commandSelected(command);
  }

  return (
    <div className="border bg-background rounded-b-xl">
      <CommandComponent className="rounded-xl outline-none focus:outline-none">
        <CommandInput ref={inputRef} onFocus={onFocus} placeholder="Search..." />
        <CommandList >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Hot-Keys">
            {commands.length ? commands.map((command, i) => <Item key={i} command={command} onSelect={onCommandSelected} />) : <div />}
          </CommandGroup>
        </CommandList>
      </CommandComponent>
      <Footer />
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <div className="flex justify-end items-center border-t h-[45px] bg-background rounded-b-xl">
      <Button variant="ghost" onClick={() => window.electronAPI.hide()}><CommandShortcut>Show/Hide ⌥Space</CommandShortcut></Button>
      <hr className="h-[20px] w-[1px] bg-border my-1" />
      <Button variant="ghost" onClick={() => window.electronAPI.quit()}><CommandShortcut>Quit ⌘Q</CommandShortcut></Button>
    </div>
  );
};

const Item: React.FC<{ command: CommandClient, onSelect: (hotKey: CommandClient) => void }> = ({ command, onSelect }) => {
  const parts: string[] = command.hotKey.split('+');
  parts.forEach((part, index, arr) => {
    arr[index] = modifierKeyMap[part] ?? part;
  });

  return (
    <CommandItem onSelect={() => onSelect(command)}>
      <span>{command.displayName}</span>
      {parts.length ? <CommandShortcut>{parts.join('')}</CommandShortcut> : <div />}
    </CommandItem>
  );
};

export { Prompt };
