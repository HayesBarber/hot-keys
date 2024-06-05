import { ClipboardRecord } from "../models/clipboardRecord";
import usePasteboard from "../hooks/usePasteboard";
import { FooterMain } from "./footer";

const Pasteboard: React.FC<{ back: () => void }> = ({ back }) => {
    const pasteboardItems = usePasteboard();

    return (
        <div className="bg-background rounded-b-xl flex flex-col h-screen">
            <div className="flex grow">
                <div className="w-[40%]">
                    <ul>
                        {pasteboardItems.length ? pasteboardItems.map((item, i) => <PasteboardListItem key={i} record={item} onSelect={(item) => { }} />) : <div />}
                    </ul>
                </div>
                <hr className="w-[1px] mx-1 bg-border" />
                <div className="w-[60%]">

                </div>
            </div>
            <FooterMain showPasteboard={back} />
        </div>
    );
};

const PasteboardListItem: React.FC<{ record: ClipboardRecord, onSelect: (record: ClipboardRecord) => void }> = ({ record, onSelect }) => {
    return (
        <li>{record.type}</li>
    );
};

export default Pasteboard;