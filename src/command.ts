interface Command {
    hotKey?: string | null | undefined,
    command: string,
    displayName: string,
}

interface CommandClient {
    hotKey: string,
    displayName: string,
}

export { Command, CommandClient };
