import { CommandClient } from './models/command'

export interface IElectronAPI {
    commandSelected: (command: CommandClient) => void,
    hide: () => void,
    ready: () => void,
    listenForCommands: (callback: (value: CommandClient[]) => any) => void,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
