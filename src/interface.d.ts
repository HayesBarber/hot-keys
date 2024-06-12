import { CommandClient } from "./models/command";
import { ClipboardRecord } from "./models/clipboardRecord";
import { PredefinedAccelerators } from "./models/predefinedAccelorators";

export interface IElectronAPI {
  commandSelected: (command: CommandClient) => void;
  hide: () => void;
  quit: () => void;
  readyForCommands: () => void;
  listenForCommands: (callback: (value: CommandClient[]) => any) => void;
  readyForPasteboard: () => void;
  listenForPasteboard: (callback: (value: ClipboardRecord[]) => any) => void;
  pasteToPasteboard: () => void;
  clearPasteboard: () => void;
  showPasteboard: (callback: () => void) => void;
  deletePasteboardItem: (i: number) => void;
  copyToClipboard: (clipboardRecord: ClipboardRecord) => void;
  readyForAccelerators: () => void;
  listenForAccelerators: (
    callback: (value: PredefinedAccelerators) => any
  ) => void;
  readyForTheme: () => void;
  listenForTheme: (callback: (value: string) => any) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
