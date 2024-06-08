import { useEffect, useState } from "react";
import {
  PredefinedAccelerators,
  defaultPredefinedAccelerators,
} from "../models/predefinedAccelorators";

const usePredefinedAccelerators = () => {
  const [predefinedAccelerators, setPredefinedAccelerators] =
    useState<PredefinedAccelerators>(defaultPredefinedAccelerators);

  useEffect(() => {
    window.electronAPI.listenForAccelerators(setPredefinedAccelerators);
    window.electronAPI.readyForAccelerators();
  }, []);

  return predefinedAccelerators;
};

export default usePredefinedAccelerators;
