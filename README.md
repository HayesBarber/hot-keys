<div align="center">
    <img src="src/assets/tray-icon.png" alt="Icon" height="300px"/>
</div>

# Hot-Keys ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/hayesbarber/hot-keys/total)

Two main features:

1. Map commands to keyboard shortcuts (or execute them throught the UI)
2. Pasteboard

<div align="center">
    <img src="src/assets/ui-image.png" alt="UI"/>
</div>

## Built with

- [**Electron**](https://www.electronjs.org)
- [**React**](https://react.dev)
- [**shadcn/ui**](https://ui.shadcn.com)
- [**cmdk**](https://github.com/pacocoursey/cmdk)
- [**tailwindcss**](https://tailwindcss.com)
- [**Geist Font**](https://github.com/vercel/geist-font/blob/main/LICENSE.txt)

## Quick Start

Download and install the latest release.

Hot-Keys will read from a `hot-keys.json` file in your **_home directory_**.

### Example hot-keys.json

```bash
cd ~
```

```bash
touch hot-keys.json
```

```bash
# if using VSCode
code hot-keys.json
```

```json
{
  // "built in" accelerators
  // these have defaults if they are not present
  // use an empty string if you do not want to use it
  "toggleUI": "Option+Space",
  "addToPasteboard": "Command+Shift+V",
  "viewPasteboard": "Option+Shift+V",
  // these are your hot-keys
  // the "hotKey" field is optional if you do not want to take up a keyboard shortcut
  "commands": [
    {
      "hotKey": "Option+Command+P",
      "command": "code -n",
      "displayName": "Open new VSCode window"
    },
    {
      "hotKey": "Option+Command+I",
      "command": "osascript -e 'quit app \"safari.app\"'",
      "displayName": "Close Safari"
    },
    {
      "command": "osascript -e 'quit app \"messages.app\"'",
      "displayName": "Close Messages"
    },
    {
      "command": "code ~/hot-keys.json",
      "displayName": "Open hot-keys.json"
    }
  ]
}
```

## Dev environment setup _todo_

1. Clone the repo
2. Install dependencies

```bash
npm install
```

3. Run the application

```bash
npm run start
```
