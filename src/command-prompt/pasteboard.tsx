import { ClipboardRecord } from "../models/clipboardRecord";
import usePasteboard from "../hooks/usePasteboard";
import { FooterButton, FooterMain } from "./footer";
import { ArrowBigLeft } from "lucide-react"
import {
    Command as CommandComponent,
    CommandList,
    CommandGroup,
    CommandItem,
} from "../components/command";
import { useState } from "react";

const Pasteboard: React.FC<{ back: () => void }> = ({ back }) => {
    const pasteboardItems = usePasteboard();
    const [selected, setSelected] = useState(pasteboardItems.length > 0 ? pasteboardItems[0] : null);

    return (
        <div className="window">
            <div className="flex grow overflow-hidden">
                <div className="w-[40%]">
                    <CommandComponent className="rounded-xl outline-none focus:outline-none flex flex-col">
                        <CommandList className="grow" >
                            <PasteboardItems records={pasteboardItems} onRecordSelected={() => { }} />
                        </CommandList>
                    </CommandComponent>
                </div>
                <div className="w-[60%] my-2 border-l">

                </div>
            </div>
            <FooterMain>
                <FooterButton onClick={() => back()} >
                    <ArrowBigLeft className="mr-2 h-4 w-4 shrink-0 opacity-50" />Back
                </FooterButton>
                <div className="flex items-center">
                    <FooterButton onClick={() => window.electronAPI.clearPasteboard()} >
                        Clear pasteboard
                    </FooterButton>
                    <hr className="h-[20px] w-[1px] bg-border" />
                    <FooterButton onClick={() => window.electronAPI.pasteToPasteboard()} >
                        Add to pasteboard: ⌘⇧V
                    </FooterButton>
                </div>
            </FooterMain>
        </div>
    );
};

const PasteboardItems: React.FC<{ records: ClipboardRecord[], onRecordSelected: (record: ClipboardRecord) => void }> = ({ records, onRecordSelected }) => {
    return (
        <div>
            <CommandGroup heading="Pasteboard">
                {records.length ? records.map((record, i) => <PasteboardListItem key={i} record={record} onSelect={onRecordSelected} />) : <div />}
            </CommandGroup>
        </div>
    );
};

const PasteboardListItem: React.FC<{ record: ClipboardRecord, onSelect: (record: ClipboardRecord) => void }> = ({ record, onSelect }) => {
    return (
        <CommandItem className="flex flex-col items-start justify-center" onSelect={() => onSelect(record)}>
            <div>{record.type}</div>
            <div className="text-xs text-muted-foreground">{new Date(record.timeOfCopy).toLocaleString()}</div>
        </CommandItem>
    );
};

export default Pasteboard;
