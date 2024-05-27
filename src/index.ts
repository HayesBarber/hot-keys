import { app, BrowserWindow, globalShortcut, Tray, Menu } from 'electron';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import Command from './command';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

let tray: Tray | null = null
let window: BrowserWindow | null = null;
let commands: Array<Command> | null = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
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

  const url = `${ MAIN_WINDOW_WEBPACK_ENTRY }?commands=${ commands }`;

  await window.loadURL(url);

  app.dock.hide();
};

app.on('ready', async () => {
  const fileContent = readFileSync('src/commands.json', 'utf-8');
  commands = JSON.parse(fileContent);
  console.log(commands);

  commands.forEach((value) => {
    globalShortcut.register(value.hotKey, () => {
      console.log(`running ${ value.command } from input ${ value.hotKey }`);
      exec(value.command);
    });
  });

  await createWindow();

  globalShortcut.register('Command+Shift+Space', () => {
    toggle();
  });

  const menu = Menu.buildFromTemplate([
    { role: 'quit', label: 'Quit Commands', accelerator: 'Command+Q' },
  ]);

  if (!tray) {
    tray = new Tray('src/icon.png');
  }

  tray.setContextMenu(menu);
});


const toggle = () => {
  console.log(`open input event`);

  if (window.isFocused()) {
    window.hide();
  } else {
    window.show();
  }
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
