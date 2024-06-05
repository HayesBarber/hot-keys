import { Button } from "../components/button";
import { Clipboard } from "lucide-react"
import { CommandShortcut, } from "../components/command";

export const Footer: React.FC<{ showPasteboard: () => void }> = ({ showPasteboard }) => {
    return (
        <div className="px-2">
            <div className="flex justify-between items-center border-t h-[45px] bg-background rounded-b-xl">
                <Button variant="ghost" onClick={showPasteboard}><CommandShortcut className="flex items-center" ><Clipboard className="mr-2 h-4 w-4 shrink-0 opacity-50" />View Pasteboard</CommandShortcut></Button>
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => window.electronAPI.hide()}><CommandShortcut>Show/Hide: ⌥Space</CommandShortcut></Button>
                    <hr className="h-[20px] w-[1px] bg-border" />
                    <Button variant="ghost" onClick={() => window.electronAPI.quit()}><CommandShortcut>Quit: ⌘Q</CommandShortcut></Button>
                </div>
            </div>
        </div>
    );
};
