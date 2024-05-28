import { globalShortcut } from 'electron';
import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { Command } from '../command';
import { homedir } from 'os';
import { join } from 'path';
import { createKey } from './createKey';

const quit: Command = {
    hotKey: 'Command+Q',
    displayName: 'Quit',
    command: '',
};
const quitKey = createKey(quit);

const toggle: Command = {
    hotKey: 'Command+Shift+Space',
    displayName: 'Show/Hide',
    command: '',
};
const toggleKey = createKey(toggle);

const registerHotKeys = (commands: Record<string, Command>, toggleFunction: () => void) => {
    const home = homedir();
    const filePath = join(home, 'commands.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const objects: Array<Command> = JSON.parse(fileContent);
    console.log(objects);

    objects.forEach((value) => {
        commands[createKey(value)] = value;

        if (value.hotKey) {
            globalShortcut.register(value.hotKey, () => {
                console.log(`running ${value.command} from input ${value.hotKey}`);
                exec(value.command);
            });
        }
    });

    globalShortcut.register(toggle.hotKey, () => {
        toggleFunction();
    });

    commands[toggleKey] = toggle;
    commands[quitKey] = quit;
}

export {
    quit,
    quitKey,
    toggle,
    toggleKey,
    registerHotKeys,
};