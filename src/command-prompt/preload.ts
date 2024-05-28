import { contextBridge, ipcRenderer } from 'electron';
import {CommandClient} from '../lib/command';

contextBridge.exposeInMainWorld('electronAPI', {
    commandSelected: (command: CommandClient) => ipcRenderer.send('command-selected', command),
    hide: () => ipcRenderer.send('hide'),
});
