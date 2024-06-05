import { PropsWithChildren } from "react";

export const FooterMain: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="px-2">
            <div className="flex justify-between items-center border-t h-[45px] bg-background rounded-b-xl">
                {children}
            </div>
        </div>
    );
};
