/**
 * Electron MAIN-process helper. A renderer webview can't open the system
 * browser directly (and shouldn't navigate the app window to an ad landing
 * page), so the main process exposes a tiny bridge the renderer calls through
 * `window.adviverse.openExternal()`.
 *
 * main.ts:
 *   import { registerAdviverse } from '@adviverse/electron';
 *   registerAdviverse();               // once, after app is ready
 *   // ...and in your BrowserWindow webPreferences: preload: adviversePreloadPath()
 *
 * If you already have a preload, instead add ONE line to it:
 *   import { exposeAdviverse } from '@adviverse/electron';
 *   exposeAdviverse();                 // in the preload script
 * and in main: registerAdviverseIpc();
 */
import { ipcMain, shell, contextBridge } from 'electron';
import * as path from 'path';

const CHANNEL = 'adviverse:openExternal';

/** Call in the MAIN process: handle open-external requests, allowing http(s) only. */
export function registerAdviverseIpc(): void {
  ipcMain.handle(CHANNEL, (_evt, url: unknown) => {
    if (typeof url === 'string' && /^https?:\/\//i.test(url)) {
      return shell.openExternal(url);
    }
    return undefined;
  });
}

/** Call in the PRELOAD script: expose window.adviverse.openExternal to the renderer. */
export function exposeAdviverse(): void {
  // Lazy require so this file is importable in the main process too (package is CommonJS).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ipcRenderer } = require('electron') as typeof import('electron');
  contextBridge.exposeInMainWorld('adviverse', {
    openExternal: (url: string) => ipcRenderer.invoke(CHANNEL, url),
  });
}

/** Path to a ready-made preload that calls exposeAdviverse(); use in webPreferences.preload. */
export function adviversePreloadPath(): string {
  return path.join(__dirname, 'preload.js');
}

/** Convenience: register the IPC handler (main process). Pair with a preload that
 *  calls exposeAdviverse(), e.g. adviversePreloadPath(). */
export function registerAdviverse(): void {
  registerAdviverseIpc();
}
