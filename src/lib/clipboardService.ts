import { clipboard } from "electron";
import { ClipboardRecord } from "../models/clipboardItem";
import { readFileFromHomeDirectory, writeFileInHomeDirectory } from "./fileUtils";

class ClipboardService {
    public clipboardRecords: ClipboardRecord[];
    private clipboardFileName = 'hot-keys-pasteboard.json';

    constructor() {
        this.clipboardRecords = this.readClipboardFile();
    }

    public readClipboard = () => {
        const formats = clipboard.availableFormats();

        const isText = formats.includes('text/plain');

        let content: string = null;

        if (isText) {
            content = clipboard.readText().trim();
        } else {
            const data = clipboard.readImage();
            if (!data.isEmpty()) {
                content = data.toDataURL();
            }
        }
        
        // todo check that we don't already have this clipboard record
        if(content) {
            this.clipboardRecords.push({ content });
            this.writeToClipboardFile();
        }
    };

    private readClipboardFile = () => readFileFromHomeDirectory<ClipboardRecord[]>(this.clipboardFileName, []);

    private writeToClipboardFile = () => writeFileInHomeDirectory(this.clipboardFileName, this.clipboardRecords);
}

export default ClipboardService;
