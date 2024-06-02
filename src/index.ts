import { app, BrowserWindow, Tray, Menu, ipcMain, IpcMainEvent, nativeImage } from 'electron';
import { CommandClient, CommandExecutable } from './models/command';
import { registerHotKeys } from './lib/registerHotKeys';
import { quit } from './lib/quit';
import { join } from 'path';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let tray: Tray | null = null
let window: BrowserWindow | null = null;
let commands: CommandExecutable[] = [];

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
  let assetsPath = 'src/assets';

  if(app.isPackaged) {
    assetsPath = process.resourcesPath;
  }

  const path = join(assetsPath, 'tray-icon.png');

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
    show: false,
  });

  window.setVisibleOnAllWorkspaces(true);

  const clientCommands: CommandClient[] = Object.values(commands).map((e, i) => {
    return {
      hotKey: e.hotKey ?? '',
      displayName: e.displayName,
      index: i,
    };
  });

  await window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  window.webContents.send('sendCommands', clientCommands);
  window.show();
};

const onCommandSelected = (event: IpcMainEvent, command: CommandClient) => {
  const i = command.index;

  if (i < 0 || i > commands.length - 1) return;

  try {
    commands[i].execute();
  } catch (error) { }


  hide();
}
