
<div align="center">
    <img src="src/assets/tray-icon.png" alt="Icon" height="200px"/>
</div>

# Hot-Keys

Map commands to keyboard shortcuts.

<div align="center">
    <img src="src/assets/ui-image.png" alt="UI"/>
</div>

## Built with

* [**Electron**](https://www.electronjs.org)
* [**React**](https://react.dev)
* [**shadcn/ui**](https://ui.shadcn.com)
* [**tailwindcss**](https://tailwindcss.com)
* [**Geist Font**](https://github.com/vercel/geist-font/blob/main/LICENSE.txt)

## Quick Start

Download and install the latest release. ***todo***

Hot-Keys will read from a ```commands.json``` file in your ***home directory***.

This should be an ***array of json objects***.

Each object should contain these fields:

* ```hotKey``` (optional)
* ```command```
* ```displayName```

### Example commands.json

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

You can execute the commands by their ```hotKey``` or via the UI.

Hitting ***Command+Shift+Space*** will toggle the UI to be shown.

*Note: The UI does not have to be visible for the hotKeys to work. You do not have to use the UI.*

## Dev environment setup
