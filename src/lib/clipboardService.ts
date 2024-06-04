import { clipboard } from "electron";
import { ClipboardRecord } from "../models/clipboardItem";
import { readFileFromHomeDirectory } from "./fileUtils";

class ClipboardService {
    public clipboardRecords: ClipboardRecord[];

    constructor() {
        this.clipboardRecords = this.readClipboardFile();
    }

    public readClipboard = () => {
        const formats = clipboard.availableFormats();
        console.log(formats);

        const isText = formats.includes('text/plain');

        if (isText) {
            const text = clipboard.readText().trim();
            console.log(text);
            return;
        }

        const data = clipboard.readImage();
        if (!data.isEmpty()) {
            console.log(data.toDataURL());
            return;
        }
    };

    private readClipboardFile = () => readFileFromHomeDirectory<ClipboardRecord[]>('hot-keys-pasteboard.json', []);
}

export default ClipboardService;
