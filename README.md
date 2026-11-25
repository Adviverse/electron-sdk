# @adviverse/electron

Electron **main-process + preload** bridge for Adviverse desktop ads. A renderer
can't (and shouldn't) open the system browser itself; this exposes
`window.adviverse.openExternal()` so ad clicks open the **default browser**
(http(s) only; safe with `contextIsolation: true`).

Render the ad in your renderer with [`@adviverse/desktop`](https://github.com/Adviverse/desktop-sdk)
(no framework) or [`@adviverse/desktop-react`](https://github.com/Adviverse/desktop-react-sdk);
they detect this bridge automatically.

## Install

```sh
npm install @adviverse/electron
```

## Usage

```ts
// main.ts
import { app, BrowserWindow } from 'electron';
import { registerAdviverseIpc, adviversePreloadPath } from '@adviverse/electron';

app.whenReady().then(() => {
  registerAdviverseIpc(); // handles openExternal, http(s) only
  new BrowserWindow({
    webPreferences: { contextIsolation: true, preload: adviversePreloadPath() },
  });
});
```

Already have a preload? Add one line to it instead:

```ts
// preload.ts
import { exposeAdviverse } from '@adviverse/electron';
exposeAdviverse();               // → window.adviverse.openExternal
```

