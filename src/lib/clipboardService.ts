import { clipboard } from "electron";

const readClipboard = () => {
    const formats = clipboard.availableFormats();
    console.log(formats);

    const isText = formats.includes('text/plain');

    if (isText) {
        const text = clipboard.readText().trim();
        console.log(text);
        return;
    }

    const data = clipboard.readImage();
    if (!data.isEmpty()) {
        console.log('image');
        return;
    }
}

export { readClipboard };
