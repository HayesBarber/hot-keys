import { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain, IpcMainEvent } from 'electron';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import Command from './command';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let tray: Tray | null = null
let window: BrowserWindow | null = null;
let commands: Record<string, Command> = {};

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
  registerHotKeys();

  globalShortcut.register('Command+Shift+Space', () => {
    toggle();
  });

  buildMenu();

  ipcMain.on('command-selected', onCommandSelected)

  await createWindow();

  setTimeout(() => {
    app.dock.hide();
  }, 2000);
});

const registerHotKeys = () => {
  const fileContent = readFileSync('src/commands.json', 'utf-8');
  const objects: Array<Command> = JSON.parse(fileContent);
  console.log(objects);

  objects.forEach((value) => {
    commands[value.hotKey] = value;

    globalShortcut.register(value.hotKey, () => {
      console.log(`running ${value.command} from input ${value.hotKey}`);
      exec(value.command);
    });
  });
}

const toggle = () => {
  if (window.isFocused()) {
    window.hide();
  } else {
    window.show();
  }
}

const buildMenu = () => {
  const menu = Menu.buildFromTemplate([
    { role: 'quit', label: 'Quit Commands', accelerator: 'Command+Q' },
  ]);

  if (!tray) {
    tray = new Tray('src/icon.png');
  }

  tray.setContextMenu(menu);
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

  const stringify = JSON.stringify(Object.values(commands));
  const url = `${MAIN_WINDOW_WEBPACK_ENTRY}?commands=${stringify}`;
  await window.loadURL(url);
};

const onCommandSelected = (event: IpcMainEvent, command: string) => {
  const host = (new URL(event.senderFrame.url)).host;
  if (host !== 'localhost:3000') return;

  const key = command.split(' ').join('+');
  const actual = commands[key]?.command;

  if(!actual) return;

  exec(actual);

  window.hide();
}
