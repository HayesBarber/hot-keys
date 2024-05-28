import { app, BrowserWindow, Tray, Menu, ipcMain, IpcMainEvent, nativeImage } from 'electron';
import { CommandClient, CommandExecutable } from './lib/command';
import { createKey } from './lib/createKey';
import { registerHotKeys } from './lib/registerHotKeys';
import { quit } from './lib/quit';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let tray: Tray | null = null
let window: BrowserWindow | null = null;
let commands: Record<string, CommandExecutable> = {};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  registerHotKeys(commands, toggle, hide);

  buildMenu();

  ipcMain.on('command-selected', onCommandSelected);
  ipcMain.on('hide', () => hide());

  await createWindow();

  setTimeout(() => {
    app.dock.hide();
  }, 2000);
});

const focused = () => window.isFocused();
const hide = () => window.hide();
const show = () => window.show();
const toggle = () => focused() ? hide() : show();

const buildMenu = () => {
  const menu = Menu.buildFromTemplate([
    { role: 'quit', label: quit.displayName, accelerator: quit.hotKey },
  ]);

  let icon = buildIcon();
  tray = new Tray(icon);
  tray.setContextMenu(menu);
}

const buildIcon = () => {
  const path = 'src/tray-icon.png';

  let icon = nativeImage.createFromPath(path);
  icon = icon.resize({ width: 28, height: 28 });

  return icon;
}

const createWindow = async (): Promise<void> => {
  window = new BrowserWindow({
    height: 500,
    width: 700,
    frame: false,
    fullscreenable: false,
    resizable: false,
    movable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    show: true,
  });

  window.setVisibleOnAllWorkspaces(true);

  const clientCommands: CommandClient[] = Object.values(commands).map((e) => {
    return {
      hotKey: e.hotKey ?? '',
      displayName: e.displayName,
    };
  });

  const stringify = JSON.stringify(clientCommands);
  const url = `${MAIN_WINDOW_WEBPACK_ENTRY}?commands=${stringify}`;
  await window.loadURL(url);
};

const onCommandSelected = (event: IpcMainEvent, command: CommandClient) => {
  const host = (new URL(event.senderFrame.url)).host;
  if (host !== 'localhost:3000') return;

  const key = createKey(command);

  const actual = commands[key]?.execute;

  if(!actual) return;

  actual();

  hide();
}
