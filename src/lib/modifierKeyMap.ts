export const modifierKeyMap: Record<string, string> = {
  Command: "⌘",
  Option: "⌥",
  Shift: "⇧",
  Control: "⌃",
  "Caps Lock": "⇪",
  Function: "Fn",
};

export const acceleratorToDisplay = (accelerator: string) => {
  const parts: string[] = accelerator.split("+");
  parts.forEach((part, index, arr) => {
    arr[index] = modifierKeyMap[part] ?? part;
  });

  return parts.join("");
};
