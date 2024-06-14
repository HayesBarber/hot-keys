import { CommandClient } from "../../models/command";
import useFocus from "../../hooks/useFocus";
import { acceleratorToDisplay, modifierKeyMap } from "../../lib/modifierKeyMap";
import { FooterButton, FooterMain } from "./footer";
import { Clipboard } from "lucide-react";
import {
  Command as CommandComponent,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../../components/command";
import { useGlobalState } from "../../hooks/useGlobalState";
import { HorizontalDivider } from "../../components/divider";

const Commands: React.FC = () => {
  const inputRef = useFocus();
  const { setShowPasteboard, predefinedAccelerators, commands } =
    useGlobalState();

  const showPasteboard = () => {
    setShowPasteboard(true);
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.target.select();
  };

  const onCommandSelected = (command: CommandClient) => {
    window.electronAPI.commandSelected(command);
  };

  return (
    <div className="window">
      <CommandComponent className="outline-none focus:outline-none flex flex-col grow">
        <CommandInput
          ref={inputRef}
          onFocus={onFocus}
          placeholder="Search..."
        />
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandList className="grow">
          <CommandsList
            commands={commands}
            onCommandSelected={onCommandSelected}
          />
        </CommandList>
      </CommandComponent>
      <FooterMain>
        <FooterButton onClick={() => showPasteboard()}>
          <Clipboard className="icon" />
          View Pasteboard
          {acceleratorToDisplay(predefinedAccelerators.viewPasteboard, ":")}
        </FooterButton>
        <div className="flex items-center">
          <FooterButton onClick={() => window.electronAPI.hide()}>
            Show/Hide
            {acceleratorToDisplay(predefinedAccelerators.toggleUI, ":")}
          </FooterButton>
          <HorizontalDivider />
          <FooterButton onClick={() => window.electronAPI.quit()}>
            Quit: ⌘Q
          </FooterButton>
        </div>
      </FooterMain>
    </div>
  );
};

const CommandsList: React.FC<{
  commands: CommandClient[];
  onCommandSelected: (command: CommandClient) => void;
}> = ({ commands, onCommandSelected }) => {
  return (
    <div>
      <CommandGroup heading="Hot-Keys">
        {commands.length ? (
          commands.map((command, i) => (
            <CommandListItem
              key={i}
              command={command}
              onSelect={onCommandSelected}
            />
          ))
        ) : (
          <div />
        )}
      </CommandGroup>
    </div>
  );
};

const CommandListItem: React.FC<{
  command: CommandClient;
  onSelect: (hotKey: CommandClient) => void;
}> = ({ command, onSelect }) => {
  const shortCut = acceleratorToDisplay(command.hotKey);

  return (
    <CommandItem onSelect={() => onSelect(command)}>
      <span>{command.displayName}</span>
      {shortCut.length ? (
        <CommandShortcut>{shortCut}</CommandShortcut>
      ) : (
        <div />
      )}
    </CommandItem>
  );
};

export default Commands;
