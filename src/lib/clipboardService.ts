import { clipboard } from "electron";
import { ClipboardRecord } from "../models/clipboardRecord";
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
        let timeOfCopy = Date.now();

        if (isText) {
            content = clipboard.readText().trim();
        } else {
            const data = clipboard.readImage();
            if (!data.isEmpty()) {
                content = data.toDataURL();

            }
        }

        if (content) {
            for (let i = 0; i < this.clipboardRecords.length; i++) {
                const element = this.clipboardRecords[i];
                if (content === element.content) return;
            }

            this.clipboardRecords.push({ content, type: isText ? 'Text' : 'Image', timeOfCopy });
            this.writeToClipboardFile();
        }
    };

    private readClipboardFile = () => readFileFromHomeDirectory<ClipboardRecord[]>(this.clipboardFileName, []);

    private writeToClipboardFile = () => writeFileInHomeDirectory(this.clipboardFileName, this.clipboardRecords);
}

export default ClipboardService;
