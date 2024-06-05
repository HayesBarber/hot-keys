import { CommandClient } from "../models/command";
import useEscapeKey from "../hooks/useEscapeKey";
import useFocus from "../hooks/useFocus";
import useCommands from "../hooks/useCommands";
import { modifierKeyMap } from "../lib/modifierKeyMap";
import { useState } from "react";
import Pasteboard from "./pasteboard";
import { Footer } from "./footer";

import {
  Command as CommandComponent,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../components/command";

const Prompt: React.FC = () => {
  const inputRef = useFocus();
  useEscapeKey(() => window.electronAPI.hide());
  const commands = useCommands();
  const [showPasteboard, setShowPasteboard] = useState(false);

  const onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.target.select();
  }

  const onCommandSelected = (command: CommandClient) => {
    window.electronAPI.commandSelected(command);
  }

  return (
    <>
      {showPasteboard && <Pasteboard />}
      {
        !showPasteboard &&
        <div className="bg-background rounded-b-xl flex flex-col h-screen">
          <CommandComponent className="rounded-xl outline-none focus:outline-none flex flex-col grow">
            <CommandInput ref={inputRef} onFocus={onFocus} placeholder="Search..." />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList className="grow" >
              <Commands commands={commands} onCommandSelected={onCommandSelected} />
            </CommandList>
          </CommandComponent>
          <Footer showPasteboard={() => setShowPasteboard(!showPasteboard)} />
        </div>
      }
    </>
  );
};

const Commands: React.FC<{ commands: CommandClient[], onCommandSelected: (command: CommandClient) => void }> = ({ commands, onCommandSelected }) => {
  return (
    <div>
      <CommandGroup heading="Hot-Keys">
        {commands.length ? commands.map((command, i) => <CommandListItem key={i} command={command} onSelect={onCommandSelected} />) : <div />}
      </CommandGroup>
    </div>
  );
};

const CommandListItem: React.FC<{ command: CommandClient, onSelect: (hotKey: CommandClient) => void }> = ({ command, onSelect }) => {
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
