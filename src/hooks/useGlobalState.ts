import { createContext, useContext } from "react";
import {
  PredefinedAccelerators,
  defaultPredefinedAccelerators,
} from "../models/predefinedAccelorators";

export type GlobalState = {
  showPasteboard: boolean;
  predefinedAccelerators: PredefinedAccelerators;
  setShowPasteboard: (show: boolean) => void;
};

export const defaultGlobalState: GlobalState = {
  showPasteboard: false,
  predefinedAccelerators: defaultPredefinedAccelerators,
  setShowPasteboard: () => null,
};

export const GlobalProviderContext =
  createContext<GlobalState>(defaultGlobalState);

export const useGlobalState = () => {
  const context = useContext(GlobalProviderContext);

  return context;
};
