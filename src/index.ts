import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  ipcMain,
  IpcMainEvent,
  nativeImage,
} from "electron";
import { CommandClient, CommandExecutable } from "./models/command";
import { registerHotKeys } from "./lib/registerHotKeys";
import { join } from "path";
import ClipboardService from "./lib/clipboardService";
import { PredefinedAccelerators } from "./models/predefinedAccelorators";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let tray: Tray | null = null;
let window: BrowserWindow | null = null;
let commands: CommandExecutable[] = [];
let clipboardService: ClipboardService = null;
let accelerators: PredefinedAccelerators = null;

const getClientCommands = () =>
  Object.values(commands).map((e, i) => {
    return {
      hotKey: e.hotKey ?? "",
      displayName: e.displayName,
      index: i,
    };
  });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", async () => {
  buildMenu();

  await createWindow();

  clipboardService = new ClipboardService(window);

  accelerators = registerHotKeys(commands, toggleWindow, clipboardService);

  ipcMain.on("command-selected", onCommandSelected);
  ipcMain.on("hide", () => hide());
  ipcMain.on("quit", () => app.quit());
  ipcMain.on("readyForCommands", (e) =>
    e.reply("sendCommands", getClientCommands())
  );
  ipcMain.on("readyForPasteboard", (e) =>
    e.reply("sendPasteboard", clipboardService.clipboardRecords)
  );
  ipcMain.on("readyForAccelerators", (e) =>
    e.reply("sendAccelerators", accelerators)
  );

  await window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  show();

  setTimeout(() => {
    app.dock.hide();
  }, 2000);
});

const focused = () => window.isFocused();
const hide = () => window.hide();
const show = () => window.show();
const toggleWindow = () => (focused() ? hide() : show());

const buildMenu = () => {
  const template: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] =
    [
      {
        label: "Restart",
        click: () => {
          app.relaunch();
          app.exit();
        },
      },
      {
        role: "quit",
        label: "Quit",
        accelerator: "Command+Q",
      },
    ];

  if (!app.isPackaged) {
    template.unshift({
      label: "Dev tools",
      click: () => {
        window.webContents.openDevTools();
      },
    });
  }

  const menu = Menu.buildFromTemplate(template);

  let icon = buildIcon();
  tray = new Tray(icon);
  tray.setContextMenu(menu);
};

const buildIcon = () => {
  let assetsPath = "src/assets";

  if (app.isPackaged) {
    assetsPath = process.resourcesPath;
  }

  const path = join(assetsPath, "tray-icon.png");

  let icon = nativeImage.createFromPath(path);
  icon = icon.resize({ width: 28, height: 28 });

  return icon;
};

const createWindow = async (): Promise<void> => {
  window = new BrowserWindow({
    height: 400,
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
};

const onCommandSelected = (_event: IpcMainEvent, command: CommandClient) => {
  const i = command.index;

  if (i < 0 || i > commands.length - 1) return;

  try {
    commands[i].execute();
  } catch (error) {}

  hide();
};
