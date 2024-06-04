import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { homedir } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export function readFileFromHomeDirectory<T>(fileName: string, defaultValue: T) {
  try {
    const home = homedir();
    const filePath = join(home, fileName);
    const fileContent = readFileSync(filePath, 'utf-8');
    const parsed: T = JSON.parse(fileContent);

    return parsed;
  } catch (error) {
    return defaultValue;
  }
};

export function writeFileInHomeDirectory(fileName: string, content: any) {
  const home = homedir();
  const filePath = join(home, fileName);
  writeFileSync(fileName, JSON.stringify(content), 'utf-8');
};
