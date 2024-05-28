import { globalShortcut, BrowserWindow } from 'electron';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { Command, CommandExecutable } from './command';
import { homedir } from 'os';
import { join } from 'path';
import { quit } from './quit';

const registerHotKeys = (
    commands: CommandExecutable[],
    toggleFunction: () => void,
    hideWindow: () => void,
) => {
    const home = homedir();
    const filePath = join(home, 'commands.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const objects: Command[] = JSON.parse(fileContent);

    objects.forEach((value) => {
        commands.push({
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
    
    const toggle: CommandExecutable = {
        hotKey: 'Command+Shift+Space',
        displayName: 'Show / Hide',
        execute: () => hideWindow(),
    };

    globalShortcut.register(toggle.hotKey, () => {
        toggleFunction();
    });

    commands.push(toggle);
    commands.push(quit);
}

export {
    registerHotKeys,
};
