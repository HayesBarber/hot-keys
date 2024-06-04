import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { homedir } from 'os';
import { join } from 'path';
import { readFileSync } from 'fs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function readFileFromHomeDirctory<T>(fileName: string, defaultValue: T) {
  try {
    const home = homedir();
    const filePath = join(home, fileName);
    const fileContent = readFileSync(filePath, 'utf-8');
    const parsed: T = JSON.parse(fileContent);

    return parsed;
  } catch (error) {
    return defaultValue;
  }
}
