interface HotKeys {
  commands: Command[];
  toggleUI?: string;
  viewPasteboard?: string;
  addToPasteboard?: string;
}

interface Command {
  hotKey?: string | null | undefined;
  command: string;
  displayName: string;
}

interface CommandClient {
  hotKey: string;
  displayName: string;
  index: number;
}

interface CommandExecutable {
  hotKey: string;
  displayName: string;
  execute: () => void;
}

export { HotKeys, Command, CommandClient, CommandExecutable };
