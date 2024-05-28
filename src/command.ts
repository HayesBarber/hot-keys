interface Command {
    hotKey?: string | null | undefined,
    command: string,
    displayName: string,
}

interface CommandClient {
    hotKey?: string | null | undefined,
    displayName: string,
}

export { Command, CommandClient };
