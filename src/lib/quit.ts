import { CommandExecutable } from './command';
import { app } from 'electron';

const quit: CommandExecutable = {
    hotKey: 'Command+Q',
    displayName: 'Quit',
    execute: () => app.quit(),
};

export {
    quit,
}
