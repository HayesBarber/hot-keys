import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    commandSelected: (command: string) => ipcRenderer.send('command-selected', command)
});
