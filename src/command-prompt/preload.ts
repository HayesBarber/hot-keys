import { contextBridge, ipcRenderer } from 'electron';
import { CommandClient } from '../models/command';

contextBridge.exposeInMainWorld('electronAPI', {
    commandSelected: (command: CommandClient) => ipcRenderer.send('command-selected', command),
    hide: () => ipcRenderer.send('hide'),
    getCommands: (callback: (value: CommandClient[]) => any) => {
        ipcRenderer.on('sendCommands', (_event, value: CommandClient[]) => callback(value));
    }
});
