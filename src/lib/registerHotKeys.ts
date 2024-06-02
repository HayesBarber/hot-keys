import { globalShortcut, BrowserWindow } from 'electron';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { Command, CommandExecutable } from '../models/command';
import { homedir } from 'os';
import { join } from 'path';
import { quit } from './quit';

const parseCommands = (): Command[] => {
    try {
        const home = homedir();
        const filePath = join(home, 'commands.json');
        const fileContent = readFileSync(filePath, 'utf-8');
        const commands: Command[] = JSON.parse(fileContent);

        return commands;
    } catch (error) {
        return [];
    }
}

const registerHotKeys = (
    commandExecutables: CommandExecutable[],
    toggleFunction: () => void,
    hideWindow: () => void,
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

    const toggle: CommandExecutable = {
        hotKey: 'Option+Space',
        displayName: 'Show / Hide',
        execute: () => hideWindow(),
    };

    globalShortcut.register(toggle.hotKey, () => {
        toggleFunction();
    });

    commandExecutables.push(toggle);
    commandExecutables.push(quit);
}

export {
    registerHotKeys,
};
