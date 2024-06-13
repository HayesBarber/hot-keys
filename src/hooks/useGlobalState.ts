import { createContext, useContext } from "react";
import {
  PredefinedAccelerators,
  defaultPredefinedAccelerators,
} from "../models/predefinedAccelorators";
import { CommandClient } from "../models/command";
import { ClipboardRecord } from "../models/clipboardRecord";

export type GlobalState = {
  showPasteboard: boolean;
  predefinedAccelerators: PredefinedAccelerators;
  setShowPasteboard: (show: boolean) => void;
  commands: CommandClient[];
  pasteboard: ClipboardRecord[];
};

export const defaultGlobalState: GlobalState = {
  showPasteboard: false,
  predefinedAccelerators: defaultPredefinedAccelerators,
  setShowPasteboard: () => null,
  commands: [],
  pasteboard: [],
};

export const GlobalProviderContext =
  createContext<GlobalState>(defaultGlobalState);

export const useGlobalState = () => {
  const context = useContext(GlobalProviderContext);

  return context;
};
