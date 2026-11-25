/**
 * Ready-made Electron preload. Point webPreferences.preload at the compiled
 * preload.js (see adviversePreloadPath()). Safe with contextIsolation: true.
 */
import { exposeAdviverse } from './index';
exposeAdviverse();
