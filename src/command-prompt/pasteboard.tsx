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

const Pasteboard: React.FC<{ back: () => void }> = ({ back }) => {
    const pasteboardItems = usePasteboard();

    return (
        <div className="bg-background rounded-b-xl flex flex-col h-screen">
            <div className="flex grow overflow-hidden">
                <div className="w-[40%]">
                    <CommandComponent className="rounded-xl outline-none focus:outline-none flex flex-col">
                        <CommandList className="grow" >
                            <PasteboardItems records={pasteboardItems} onRecordSelected={() => { }} />
                        </CommandList>
                    </CommandComponent>
                </div>
                <hr className="w-[1px] mx-1 my-2 bg-border h-full" />
                <div className="w-[60%]">

                </div>
            </div>
            <FooterMain>
                <FooterButton onClick={() => back()} >
                    <ArrowBigLeft className="mr-2 h-4 w-4 shrink-0 opacity-50" />Back
                </FooterButton>
                <FooterButton onClick={() => { }} >
                    Add to pasteboard: ⌘⇧V
                </FooterButton>
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
        <CommandItem onSelect={() => onSelect(record)}>
            <span>{record.timeOfCopy}</span>
        </CommandItem>
    );
};

export default Pasteboard;