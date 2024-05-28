interface Command {
    hotKey?: string | null | undefined,
    command: string,
    displayName: string,
}

interface CommandClient {
    hotKey: string,
    displayName: string,
}

interface CommandExecutable {
    hotKey: string,
    displayName: string,
    execute: () => void,
}

export { Command, CommandClient, CommandExecutable };