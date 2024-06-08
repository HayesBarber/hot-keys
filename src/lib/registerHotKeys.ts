import { globalShortcut, BrowserWindow } from "electron";
import { exec } from "child_process";
import { Command, CommandExecutable } from "../models/command";
import ClipboardService from "./clipboardService";
import { readFileFromHomeDirectory } from "./fileUtils";

const parseCommands = () =>
  readFileFromHomeDirectory<Command[]>("commands.json", []);

const registerHotKeys = (
  commandExecutables: CommandExecutable[],
  toggleFunction: () => void,
  clipboardService: ClipboardService
) => {
  const commands = parseCommands();

  commands.forEach((value) => {
    commandExecutables.push({
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

  globalShortcut.register("Option+Space", () => {
    toggleFunction();
  });

  globalShortcut.register("Command+Shift+V", () => {
    clipboardService.readClipboard();
  });

  globalShortcut.register("Option+Shift+V", () => {
    clipboardService.showPasteboard();
  });
};

export { registerHotKeys };
