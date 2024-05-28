export interface IElectronAPI {
    commandSelected: (command: string) => Promise<void>,
    hide: () => Promise<void>,
}
  
declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
