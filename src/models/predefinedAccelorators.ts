interface PredefinedAccelerators {
  toggleUI: string;
  addToPasteboard: string;
  viewPasteboard: string;
}

const defaultPredefinedAccelerators: PredefinedAccelerators = {
  toggleUI: "Option+Space",
  addToPasteboard: "Command+Shift+V",
  viewPasteboard: "Option+Shift+V",
};

export { PredefinedAccelerators, defaultPredefinedAccelerators };
