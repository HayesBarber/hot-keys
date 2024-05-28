import Command from "./command";

export interface IElectronAPI {
    commandSelected: (command: Command) => Promise<void>,
    hide: () => Promise<void>,
}
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
