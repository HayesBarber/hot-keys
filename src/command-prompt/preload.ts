import { contextBridge, ipcRenderer } from 'electron';
import { CommandClient } from '../models/command';
import { ClipboardRecord } from '../models/clipboardRecord';

contextBridge.exposeInMainWorld('electronAPI', {
    commandSelected: (command: CommandClient) => ipcRenderer.send('command-selected', command),
    hide: () => ipcRenderer.send('hide'),
    quit: () => ipcRenderer.send('quit'),
    readyForCommands: () => ipcRenderer.send('readyForCommands'),
    listenForCommands: (callback: (value: CommandClient[]) => any) => {
        ipcRenderer.on('sendCommands', (_event, value: CommandClient[]) => callback(value));
    },
    readyForPasteboard: () => ipcRenderer.send('readyForPasteboard'),
    listenForPasteboard: (callback: (value: ClipboardRecord[]) => any) => {
        ipcRenderer.on('sendPasteboard', (_event, value: ClipboardRecord[]) => callback(value));
    },
});
