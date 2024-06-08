import { app, dialog, globalShortcut } from "electron";
import { exec } from "child_process";
import { CommandExecutable, HotKeys } from "../models/command";
import ClipboardService from "./clipboardService";
import { readFileFromHomeDirectory } from "./fileUtils";
import {
  PredefinedAccelerators,
  defaultPredefinedAccelerators,
} from "../models/predefinedAccelorators";

class RegisterHotKeysService {
  private hotKeysFileName = "hot-keys.json";
  private hotKeys: HotKeys = { commands: [] };
  private toggleUI = defaultPredefinedAccelerators.toggleUI;
  private addToPasteboard = defaultPredefinedAccelerators.addToPasteboard;
  private viewPasteboard = defaultPredefinedAccelerators.viewPasteboard;

  constructor(
    private readonly commandExecutables: CommandExecutable[],
    private readonly toggleFunction: () => void,
    private readonly clipboardService: ClipboardService
  ) {}

  public register = (): PredefinedAccelerators => {
    try {
      this.hotKeys = this.readHotKeys();
      this.registerHotKeys();
      this.setPredefinedAccelorators();
      this.registerPredefinedAccelorators();
      return {
        toggleUI: this.toggleUI,
        addToPasteboard: this.addToPasteboard,
        viewPasteboard: this.viewPasteboard,
      };
    } catch (error) {
      this.errorOnRegisteringHotKeys();
    }
  };

  private readHotKeys = (): HotKeys => {
    return readFileFromHomeDirectory<HotKeys>(
      this.hotKeysFileName,
      this.hotKeys,
      (parsed) => Array.isArray(parsed.commands)
    );
  };

  private registerHotKeys = () => {
    this.hotKeys.commands.forEach((value) => {
      this.commandExecutables.push({
        hotKey: value.hotKey,
        displayName: value.displayName,
        execute: () => exec(value.command),
      });

      if (value.hotKey) {
        globalShortcut.register(value.hotKey, () => {
          exec(value.command);
        });
      }
    });
  };

  private setPredefinedAccelorators = () => {
    if (this.hotKeys.toggleUI != null) {
      this.toggleUI = this.hotKeys.toggleUI;
    }
    if (this.hotKeys.addToPasteboard != null) {
      this.addToPasteboard = this.hotKeys.addToPasteboard;
    }
    if (this.hotKeys.viewPasteboard != null) {
      this.viewPasteboard = this.hotKeys.viewPasteboard;
    }
  };

  private registerPredefinedAccelorators = () => {
    if (this.toggleUI.length) {
      globalShortcut.register(this.toggleUI, () => {
        this.toggleFunction();
      });
    }
    if (this.addToPasteboard.length) {
      globalShortcut.register(this.addToPasteboard, () => {
        this.clipboardService.readClipboard();
      });
    }
    if (this.viewPasteboard.length) {
      globalShortcut.register(this.viewPasteboard, () => {
        this.clipboardService.showPasteboard();
      });
    }
  };

  private errorOnRegisteringHotKeys = () => {
    const message = "There was an error parsing your hot-keys.json";

    dialog.showMessageBoxSync({
      type: "error",
      message: message,
      buttons: ["Quit"],
    });

    app.exit();

    throw message;
  };
}

export { RegisterHotKeysService };
