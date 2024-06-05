import { PropsWithChildren } from "react";
import { Button } from "../components/button";
import { CommandShortcut } from "../components/command";

export const FooterMain: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="px-2">
            <div className="flex justify-between items-center border-t h-[45px] bg-background rounded-b-xl">
                {children}
            </div>
        </div>
    );
};

export const FooterButton: React.FC<PropsWithChildren<{ onClick: () => void }>> = ({ onClick, children }) => {
    return (
        <Button variant="ghost" onClick={onClick}><CommandShortcut className="flex items-center">{children}</CommandShortcut></Button>
    );
};
