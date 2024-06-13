import { contextBridge, ipcRenderer } from "electron";
import { CommandClient } from "../models/command";
import { ClipboardRecord } from "../models/clipboardRecord";
import { PredefinedAccelerators } from "../models/predefinedAccelorators";

contextBridge.exposeInMainWorld("electronAPI", {
  commandSelected: (command: CommandClient) =>
    ipcRenderer.send("command-selected", command),
  hide: () => ipcRenderer.send("hide"),
  quit: () => ipcRenderer.send("quit"),
  readyForCommands: () => ipcRenderer.send("readyForCommands"),
  listenForCommands: (callback: (value: CommandClient[]) => any) => {
    ipcRenderer.on("sendCommands", (_event, value: CommandClient[]) =>
      callback(value)
    );
  },
  readyForPasteboard: () => ipcRenderer.send("readyForPasteboard"),
  listenForPasteboard: (callback: (value: ClipboardRecord[]) => any) => {
    ipcRenderer.on("sendPasteboard", (_event, value: ClipboardRecord[]) =>
      callback(value)
    );
  },
  pasteToPasteboard: () => ipcRenderer.send("pasteToPasteboard"),
  clearPasteboard: () => ipcRenderer.send("clearPasteboard"),
  showPasteboard: (callback: () => void) => {
    ipcRenderer.on("showPasteboard", (_event) => callback());
  },
  deletePasteboardItem: (i: number) =>
    ipcRenderer.send("deletePasteboardItem", i),
  copyToClipboard: (clipboardRecord: ClipboardRecord) =>
    ipcRenderer.send("copyToClipboard", clipboardRecord),
  readyForAccelerators: () => ipcRenderer.send("readyForAccelerators"),
  listenForAccelerators: (callback: (value: PredefinedAccelerators) => any) => {
    ipcRenderer.on(
      "sendAccelerators",
      (_event, value: PredefinedAccelerators) => callback(value)
    );
  },
  readyForTheme: () => ipcRenderer.send("readyForTheme"),
  listenForTheme: (callback: (value: string) => any) => {
    ipcRenderer.on("sendTheme", (_event, value: string) => callback(value));
  },
});
