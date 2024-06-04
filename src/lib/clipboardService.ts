import { clipboard } from "electron";
import { homedir } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { ClipboardRecord } from "../models/clipboardItem";


class ClipboardService {
    private clipboardRecords: ClipboardRecord[];

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
            console.log('image');
            return;
        }
    };

    private readClipboardFile = () => {
        try {
            const home = homedir();
            const filePath = join(home, 'hot-keys-pasteboard.json');
            const fileContent = readFileSync(filePath, 'utf-8');
            const clipboardRecords: ClipboardRecord[] = JSON.parse(fileContent);

            return clipboardRecords;
        } catch (error) {
            return [];
        }
    };

}

export default ClipboardService;
