import { CommandClient } from "../models/command";
import { ClipboardRecord } from "../models/clipboardRecord";
import useEscapeKey from "../hooks/useEscapeKey";
import useFocus from "../hooks/useFocus";
import useCommands from "../hooks/useCommands";
import usePasteboard from "../hooks/usePasteboard";
import { modifierKeyMap } from "../lib/modifierKeyMap";
import { Button } from "../components/button";
import { Clipboard } from "lucide-react"
import { useState } from "react";

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
  const pasteboardItems = usePasteboard();
  const [showPasteboard, setShowPasteboard] = useState(false);

  const onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.target.select();
  }

  const onCommandSelected = (command: CommandClient) => {
    window.electronAPI.commandSelected(command);
  }

  return (
    <div className="bg-background rounded-b-xl flex flex-col h-screen">
      <CommandComponent className="rounded-xl outline-none focus:outline-none flex flex-col grow">
        <CommandInput ref={inputRef} onFocus={onFocus} placeholder="Search..." />
        <NoResults />
        <CommandList className="grow" >
          {!showPasteboard && <Commands commands={commands} onCommandSelected={onCommandSelected} />}
          {showPasteboard && <Pasteboard pasteboardItems={pasteboardItems} />}
        </CommandList>
      </CommandComponent>
      <Footer showPasteboard={() => setShowPasteboard(!showPasteboard)} />
    </div>
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

const Pasteboard: React.FC<{ pasteboardItems: ClipboardRecord[] }> = ({ pasteboardItems }) => {
  return (
    <div className="flex">
      <div className="w-[40%]">
        <CommandGroup heading="Pasteboard">
          {pasteboardItems.length ? pasteboardItems.map((item, i) => <PasteboardListItem key={i} record={item} onSelect={(item) => { }} />) : <div />}
        </CommandGroup>
      </div>
      <hr className="w-[1px] mx-1 bg-border" />
      <div className="w-[60%]">

      </div>
    </div>
  );
};

const NoResults = () => <CommandEmpty>No results found.</CommandEmpty>;

const Footer: React.FC<{ showPasteboard: () => void }> = ({ showPasteboard }) => {
  return (
    <div className="px-2">
      <div className="flex justify-between items-center border-t h-[45px] bg-background rounded-b-xl">
        <Button variant="ghost" onClick={showPasteboard}><CommandShortcut className="flex items-center" ><Clipboard className="mr-2 h-4 w-4 shrink-0 opacity-50" />View Pasteboard</CommandShortcut></Button>
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => window.electronAPI.hide()}><CommandShortcut>Show/Hide: ⌥Space</CommandShortcut></Button>
          <hr className="h-[20px] w-[1px] bg-border" />
          <Button variant="ghost" onClick={() => window.electronAPI.quit()}><CommandShortcut>Quit: ⌘Q</CommandShortcut></Button>
        </div>
      </div>
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

const PasteboardListItem: React.FC<{ record: ClipboardRecord, onSelect: (record: ClipboardRecord) => void }> = ({ record, onSelect }) => {
  return (
    <CommandItem onSelect={() => onSelect(record)}>
      <span>{1}</span>
    </CommandItem>
  );
};

export { Prompt };
