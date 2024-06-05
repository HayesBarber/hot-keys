import { ClipboardRecord } from "../models/clipboardRecord";
import usePasteboard from "../hooks/usePasteboard";
import { FooterButton, FooterMain } from "./footer";
import { Button } from "../components/button";
import { CommandShortcut } from "../components/command";
import { ArrowBigLeft } from "lucide-react"

const Pasteboard: React.FC<{ back: () => void }> = ({ back }) => {
    const pasteboardItems = usePasteboard();

    return (
        <div className="bg-background rounded-b-xl flex flex-col h-screen">
            <div className="flex grow overflow-y-scroll">
                <div className="w-[40%]">
                    <ul>
                        {pasteboardItems.length ? pasteboardItems.map((item, i) => <PasteboardListItem key={i} record={item} onSelect={(item) => { }} />) : <div />}
                    </ul>
                </div>
                <hr className="w-[1px] mx-1 bg-border h-full" />
                <div className="w-[60%]">

                </div>
            </div>
            <FooterMain>
                <FooterButton onClick={() => back()} >
                    <ArrowBigLeft className="mr-2 h-4 w-4 shrink-0 opacity-50" />Back
                </FooterButton>
                <FooterButton onClick={() => {}} >
                    Add to pasteboard: ⌘⇧V
                </FooterButton>
            </FooterMain>
        </div>
    );
};

const PasteboardListItem: React.FC<{ record: ClipboardRecord, onSelect: (record: ClipboardRecord) => void }> = ({ record, onSelect }) => {
    return (
        <>
            {record.type === 'Text' ? <li>{record.type}</li> : <img src={record.content} />}
        </>
    );
};

export default Pasteboard;