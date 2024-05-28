import { CommandClient } from './lib/command'

export interface IElectronAPI {
    commandSelected: (command: CommandClient) => Promise<void>,
    hide: () => Promise<void>,
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
