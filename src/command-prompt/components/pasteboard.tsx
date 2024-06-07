import { ClipboardRecord } from "../../models/clipboardRecord";
import usePasteboard from "../../hooks/usePasteboard";
import { FooterButton, FooterMain } from "./footer";
import useFocus from "../../hooks/useFocus";
import { ArrowBigLeft, Copy } from "lucide-react";
import {
  Command as CommandComponent,
  CommandList,
  CommandGroup,
  CommandItem,
} from "../../components/command";
import { useState } from "react";

const Pasteboard: React.FC<{ back: () => void }> = ({ back }) => {
  const pasteboardItems = usePasteboard();
  const [selected, setSelected] = useState(0);
  const ref = useFocus();

  const onValueChange = (value: string) => {
    setSelected(parseInt(value));
  };

  const onRecordSelected = (record: ClipboardRecord) => {
    window.electronAPI.copyToClipboard(record);
    back();
  };

  const deleteSelected = () => {
    window.electronAPI.deletePasteboardItem(selected);
  };

  return (
    <div className="window">
      <div className="flex grow overflow-hidden">
        <div className="w-[40%]">
          <CommandComponent
            ref={ref}
            value={`${selected}`}
            onValueChange={onValueChange}
            className="rounded-xl outline-none focus:outline-none flex flex-col"
          >
            <CommandList className="grow">
              <PasteboardItems
                selectedIndex={selected}
                records={pasteboardItems}
                onRecordSelected={onRecordSelected}
              />
            </CommandList>
          </CommandComponent>
        </div>
        <div className="w-[60%] my-2 border-l">
          <ClipboardContent records={pasteboardItems} selected={selected} />
        </div>
      </div>
      <FooterMain>
        <FooterButton onClick={() => back()}>
          <ArrowBigLeft className="icon" />
          Back
        </FooterButton>
        <div className="flex items-center">
          <FooterButton onClick={() => window.electronAPI.clearPasteboard()}>
            Clear pasteboard
          </FooterButton>
          <hr className="h-[20px] w-[1px] bg-border" />
          <FooterButton onClick={deleteSelected}>Delete Item</FooterButton>
          <hr className="h-[20px] w-[1px] bg-border" />
          <FooterButton onClick={() => window.electronAPI.pasteToPasteboard()}>
            Add to pasteboard: ⌘⇧V
          </FooterButton>
        </div>
      </FooterMain>
    </div>
  );
};

const ClipboardContent: React.FC<{
  records: ClipboardRecord[];
  selected: number;
}> = ({ records, selected }) => {
  const hasItems = records.length > 0;

  const determineContent = () => {
    if (
      !hasItems ||
      Number.isNaN(selected) ||
      selected < 0 ||
      selected > records.length - 1
    ) {
      return <></>;
    }

    const content = records[selected].content;
    const selectedIsImage = records[selected].type === "Image";

    if (selectedIsImage) {
      return <img src={content} />;
    }

    return <div>{content}</div>;
  };

  return (
    <div className="h-full flex justify-center items-center overflow-auto">
      {determineContent()}
    </div>
  );
};

const PasteboardItems: React.FC<{
  selectedIndex: number;
  records: ClipboardRecord[];
  onRecordSelected: (record: ClipboardRecord) => void;
}> = ({ selectedIndex, records, onRecordSelected }) => {
  return (
    <div>
      <CommandGroup heading="Pasteboard">
        {records.length ? (
          records.map((record, i) => (
            <PasteboardListItem
              key={i}
              index={i}
              isSelected={i === selectedIndex}
              record={record}
              onSelect={onRecordSelected}
            />
          ))
        ) : (
          <div />
        )}
      </CommandGroup>
    </div>
  );
};

const PasteboardListItem: React.FC<{
  index: number;
  isSelected: boolean;
  record: ClipboardRecord;
  onSelect: (record: ClipboardRecord) => void;
}> = ({ index, isSelected, record, onSelect }) => {
  return (
    <CommandItem
      value={`${index}`}
      className="flex justify-between"
      onSelect={() => onSelect(record)}
    >
      <div className="flex flex-col items-start justify-center">
        <div>{record.type}</div>
        <div className="text-xs text-muted-foreground">
          {new Date(record.timeOfCopy).toLocaleString()}
        </div>
      </div>
      {isSelected && (
        <div className="flex items-center justify-center text-muted-foreground">
          <Copy className="icon" />
          Copy
        </div>
      )}
    </CommandItem>
  );
};

export default Pasteboard;
