import { globalShortcut, BrowserWindow } from 'electron';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { Command, CommandExecutable } from '../command';
import { homedir } from 'os';
import { join } from 'path';
import { createKey } from './createKey';
import { quit, quitKey } from './quit';

const registerHotKeys = (
    commands: Record<string, CommandExecutable>,
    toggleFunction: () => void,
    hideWindow: () => void,
) => {
    const home = homedir();
    const filePath = join(home, 'commands.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const objects: Array<Command> = JSON.parse(fileContent);
    console.log(objects);

    objects.forEach((value) => {
        commands[createKey(value)] = {
            hotKey: value.hotKey,
            displayName: value.displayName,
            execute: () => exec(value.command),
        };

        if (value.hotKey) {
            globalShortcut.register(value.hotKey, () => {
                console.log(`running ${value.command} from input ${value.hotKey}`);
                exec(value.command);
            });
        }
    });
    
    const toggle: CommandExecutable = {
        hotKey: 'Command+Shift+Space',
        displayName: 'Show / Hide',
        execute: () => hideWindow(),
    };
    const toggleKey = createKey(toggle);

    globalShortcut.register(toggle.hotKey, () => {
        toggleFunction();
    });

    commands[toggleKey] = toggle;
    commands[quitKey] = quit;
}

export {
    registerHotKeys,
};