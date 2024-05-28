import { Command, CommandClient, CommandExecutable } from "./command";

export const createKey = (command: Command | CommandClient | CommandExecutable) => {
    const key = command.hotKey?.split(' ').join('+') ?? '';
    return `${key}-${command.displayName}`;
}