<div align="center">
    <img src="src/assets/tray-icon.png" alt="Icon" height="300px"/>
</div>

# Hot-Keys ![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/hayesbarber/hot-keys/total)

Map commands to keyboard shortcuts.

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

Download and install the latest release. **_todo_**

Hot-Keys will read from a `hot-keys.json` file in your **_home directory_**.

This should be an **_array of json objects_**.

Each object should contain these fields:

- `hotKey` (optional)
- `command`
- `displayName`

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
[
  {
    "hotKey": "Option+Command+P",
    "command": "osascript -e 'do shell script \"code -n\"'",
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
  }
]
```

You can execute the commands by their `hotKey` or via the UI.

Hitting **_Command+Shift+Space_** will toggle the UI to be shown / hidden.

_Note: The UI does not have to be visible for the hotKeys to work. You do not have to use the UI._

## Dev environment setup

1. Clone the repo
2. Install dependencies

```bash
npm install
```

3. Run the application

```bash
npm run start
```
