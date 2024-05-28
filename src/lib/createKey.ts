import { Command } from "../command";

export const createKey = (command: Command) => {
    const key = command.hotKey?.split(' ').join('+') ?? '';
    return `${key}-${command.displayName}`;
}