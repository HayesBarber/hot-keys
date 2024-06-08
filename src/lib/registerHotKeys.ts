import { globalShortcut, BrowserWindow } from "electron";
import { exec } from "child_process";
import { Command, CommandExecutable, HotKeys } from "../models/command";
import ClipboardService from "./clipboardService";
import { readFileFromHomeDirectory } from "./fileUtils";

const registerHotKeys = (
  commandExecutables: CommandExecutable[],
  toggleFunction: () => void,
  clipboardService: ClipboardService
) => {
  const defaultHotKeys: HotKeys = { commands: [] };

  const hotKeys = readFileFromHomeDirectory<HotKeys>(
    "hot-keys.json",
    defaultHotKeys,
    (parsed) => Array.isArray(parsed.commands)
  );

  hotKeys.commands.forEach((value) => {
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

  const toggle = hotKeys.toggleUI ?? "Option+Space";
  const addToPasteboard = hotKeys.addToPasteboard ?? "Command+Shift+V";
  const viewPasteboard = hotKeys.viewPasteboard ?? "Option+Shift+V";

  globalShortcut.register(toggle, () => {
    toggleFunction();
  });

  globalShortcut.register(addToPasteboard, () => {
    clipboardService.readClipboard();
  });

  globalShortcut.register(viewPasteboard, () => {
    clipboardService.showPasteboard();
  });
};

export { registerHotKeys };
