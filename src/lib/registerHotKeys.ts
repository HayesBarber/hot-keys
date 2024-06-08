import { globalShortcut } from "electron";
import { exec } from "child_process";
import { CommandExecutable, HotKeys } from "../models/command";
import ClipboardService from "./clipboardService";
import { readFileFromHomeDirectory } from "./fileUtils";
import {
  PredefinedAccelerators,
  defaultPredefinedAccelerators,
} from "../models/predefinedAccelorators";

const registerHotKeys = (
  commandExecutables: CommandExecutable[],
  toggleFunction: () => void,
  clipboardService: ClipboardService
): PredefinedAccelerators => {
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

  const toggleUI = hotKeys.toggleUI ?? defaultPredefinedAccelerators.toggleUI;
  const addToPasteboard =
    hotKeys.addToPasteboard ?? defaultPredefinedAccelerators.addToPasteboard;
  const viewPasteboard =
    hotKeys.viewPasteboard ?? defaultPredefinedAccelerators.viewPasteboard;

  if (toggleUI.length) {
    globalShortcut.register(toggleUI, () => {
      toggleFunction();
    });
  }
  if (addToPasteboard.length) {
    globalShortcut.register(addToPasteboard, () => {
      clipboardService.readClipboard();
    });
  }
  if (viewPasteboard.length) {
    globalShortcut.register(viewPasteboard, () => {
      clipboardService.showPasteboard();
    });
  }

  return {
    toggleUI,
    addToPasteboard,
    viewPasteboard,
  };
};

export { registerHotKeys };
