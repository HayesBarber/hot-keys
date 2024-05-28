import { Command, CommandClient } from "../command";

export const createKey = (command: Command | CommandClient) => {
    const key = command.hotKey?.split(' ').join('+') ?? '';
    return `${key}-${command.displayName}`;
}