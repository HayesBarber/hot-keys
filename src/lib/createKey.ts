import { Command, CommandClient, CommandExecutable } from "./command";

export const createKey = (command: Command | CommandClient | CommandExecutable) => {
    const firstPart = command.hotKey?.split(' ').join('+') ?? '';
    const secondPart = command.displayName.split(' ').join('+') ?? '';
    return `${firstPart}-${secondPart}`;
}