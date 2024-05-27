import { app, BrowserWindow, globalShortcut, Tray, Menu, ipcMain } from 'electron';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import Command from './command';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

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

  globalShortcut.register('Command+Shift+Space', () => {
    toggle();
  });

  buildMenu();

  createWindow();
});

const buildMenu = () => {
  const menu = Menu.buildFromTemplate([
    { role: 'quit', label: 'Quit Commands', accelerator: 'Command+Q' },
  ]);

  if (!tray) {
    tray = new Tray('src/icon.png');
  }

  tray.setContextMenu(menu);
}

const toggle = () => {
  if (window.isFocused()) {
    window.hide();
  } else {
    window.show();
  }
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
      contextIsolation: true
    },
    show: true,
  });
  window.setVisibleOnAllWorkspaces(true);

  const stringify = JSON.stringify(Object.values(commands));
  const url = `${MAIN_WINDOW_WEBPACK_ENTRY}?commands=${stringify}`;
  await window.loadURL(url);

  app.dock.hide();
};
