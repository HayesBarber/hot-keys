import { CommandClient } from './models/command'
import { ClipboardRecord } from './models/clipboardItem'

export interface IElectronAPI {
    commandSelected: (command: CommandClient) => void,
    hide: () => void,
    quit: () => void,
    readyForCommands: () => void,
    listenForCommands: (callback: (value: CommandClient[]) => any) => void,
    readyForPasteboard: () => void,
    listenForPasteboard: (callback: (value: ClipboardRecord[]) => any) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
