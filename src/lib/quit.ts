import { CommandExecutable } from './command';
import { createKey } from './createKey';
import { app } from 'electron';

const quit: CommandExecutable = {
    hotKey: 'Command+Q',
    displayName: 'Quit',
    execute: () => app.quit(),
};
const quitKey = createKey(quit);

export {
    quit,
    quitKey,
}
