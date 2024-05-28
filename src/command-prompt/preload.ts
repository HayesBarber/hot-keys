import { contextBridge, ipcRenderer } from 'electron';
import Command from '../command';

contextBridge.exposeInMainWorld('electronAPI', {
    commandSelected: (command: Command) => ipcRenderer.send('command-selected', command),
    hide: () => ipcRenderer.send('hide'),
});
