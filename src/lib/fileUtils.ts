import { homedir } from "os";
import { join } from "path";
import { readFileSync, writeFileSync } from "fs";

export function readFileFromHomeDirectory<T>(
  fileName: string,
  defaultValue: T,
  isValid: (parsed: any) => boolean
) {
  try {
    const home = homedir();
    const filePath = join(home, fileName);
    const fileContent = readFileSync(filePath, "utf-8");
    const parsed: T = JSON.parse(fileContent);

    if (!isValid(parsed)) {
      throw "parsed was invalid";
    }

    return parsed;
  } catch (error) {
    return defaultValue;
  }
}

export function writeFileInHomeDirectory(fileName: string, content: any) {
  const home = homedir();
  const filePath = join(home, fileName);
  writeFileSync(filePath, JSON.stringify(content), "utf-8");
}
