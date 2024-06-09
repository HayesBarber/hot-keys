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
import { RegisterHotKeysService } from "./lib/registerHotKeys";
import { join } from "path";
import ClipboardService from "./lib/clipboardService";
import {
  PredefinedAccelerators,
  defaultPredefinedAccelerators,
} from "./models/predefinedAccelorators";
import { errorOnStartup } from "./lib/errorOnStartup";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let tray: Tray | null = null;
let window: BrowserWindow | null = null;
let commands: CommandExecutable[] = [];
let clipboardService: ClipboardService = null;
let accelerators: PredefinedAccelerators = defaultPredefinedAccelerators;

const getClientCommands = () => {
  return Object.values(commands).map((e, i) => {
    return {
      hotKey: e.hotKey ?? "",
      displayName: e.displayName,
      index: i,
    };
  });
};

app.on("ready", async () => {
  buildMenu();

  await createWindow();

  clipboardService = new ClipboardService(window);

  const hotKeysService = new RegisterHotKeysService(
    commands,
    toggleWindow,
    clipboardService
  );

  if (hotKeysService.shouldAbort) return;

  accelerators = hotKeysService.predefinedAccelerators();

  registerIpcListeners();

  try {
    await window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  } catch (error) {
    errorOnStartup("There was an error starting up the application");
    return;
  }

  show();

  setTimeout(() => {
    app.dock.hide();
  }, 2000);
});

const registerIpcListeners = () => {
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
};

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

  window.on("blur", () => {
    hide();
  });
};

const onCommandSelected = (_event: IpcMainEvent, command: CommandClient) => {
  const i = command.index;

  if (i < 0 || i > commands.length - 1) return;

  try {
    commands[i].execute();
  } catch (error) {}

  hide();
};
