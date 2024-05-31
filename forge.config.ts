import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import { join } from 'path';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './src/assets/icon',
    ...(process.env.SIGN
      ? {
        osxSign: {
          identity: process.env.APPLE_IDENTITY,
        },
        osxNotarize: {
          appleId: process.env.APPLE_ID || '',
          appleIdPassword: process.env.APPLE_PASSWORD || '',
          teamId: process.env.APPLE_TEAM_ID || '',
        },
      }
      : {}),
    extraResource: [
      join(__dirname, './src/assets/tray-icon.png'),
    ],
  },
  rebuildConfig: {},
  makers: [new MakerZIP({}, ['darwin'])],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/command-prompt/index.html',
            js: './src/command-prompt/renderer.tsx',
            name: 'main_window',
            preload: {
              js: './src/command-prompt/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
