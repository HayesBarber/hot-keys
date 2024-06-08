import { app, dialog } from "electron";

export const errorOnStartup = (message: string) => {
  dialog.showMessageBoxSync({
    type: "error",
    message: message,
    buttons: ["Quit"],
  });

  app.exit();
};
