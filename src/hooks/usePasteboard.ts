import { useEffect, useState } from "react";
import { ClipboardRecord } from "../models/clipboardItem";

const usePasteboard = () => {
    const [pasteboard, setPasteboard] = useState<ClipboardRecord[]>([]);

    useEffect(() => {
        window.electronAPI.listenForPasteboard(setPasteboard);
        window.electronAPI.readyForPasteboard();
    }, []);

    return pasteboard;
}

export default usePasteboard;
