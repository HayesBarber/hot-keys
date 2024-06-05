import { BrowserWindow, clipboard, ipcMain, IpcMainEvent } from "electron";
import { ClipboardRecord } from "../models/clipboardRecord";
import { readFileFromHomeDirectory, writeFileInHomeDirectory } from "./fileUtils";

class ClipboardService {
    public clipboardRecords: ClipboardRecord[];
    private clipboardFileName = 'hot-keys-pasteboard.json';

    constructor(private readonly browserWindow: BrowserWindow) {
        this.clipboardRecords = this.readClipboardFile();
        ipcMain.on('pasteToPasteboard', () => this.readClipboard());
        ipcMain.on('clearPasteboard', () => this.clear());
        ipcMain.on('deletePasteboardItem', (_event: IpcMainEvent, i: number) => this.deletePasteboardItem(i));
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

            this.clipboardRecords.unshift({ content, type: isText ? 'Text' : 'Image', timeOfCopy });
            this.sendThenWrite();
        }
    };

    private send = () => this.browserWindow.webContents.send('sendPasteboard', this.clipboardRecords);

    private writeToClipboardFile = () => writeFileInHomeDirectory(this.clipboardFileName, this.clipboardRecords);

    private sendThenWrite = () => {
        this.send();
        this.writeToClipboardFile();
    };

    private readClipboardFile = () => readFileFromHomeDirectory<ClipboardRecord[]>(this.clipboardFileName, []);

    private clear = () => {
        this.clipboardRecords = [];
        this.sendThenWrite();
    };

    private deletePasteboardItem = (i: number) => {
        if(i < 0 || i > this.clipboardRecords.length - 1) return;

        this.clipboardRecords.splice(i, 1);
        this.sendThenWrite();
    };
}

export default ClipboardService;
