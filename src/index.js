"use strict"

import BgWave from './bg/wave';
import BgTrail from './bg/trail';
import BgTube from './bg/tube';

let bg;
let script;
let container;
let initConfig;
let startPos;

let activeBg;
const bgMap = {
  wave: BgWave,
  trail: BgTrail,
  tube: BgTube,
}

export const paused = () => bg?.paused();
export const pause = () => bg?.pause();
export const play = () => bg?.play();
export const getDefaultConfig = (bg) => ({ ...(bg ? bgMap[bg]?.config : bgMap[activeBg]?.config) });
export const getConfig = () => bg?.getConfig() || initConfig;
export const setConfig = (config) => {
  if (bg) {
    bg.setConfig(config, true);
  } else {
    initConfig = { ...config };
  }
}
export const destroy = () => {
  if (bg) {
    startPos = {
      xStart: bg.mouse.x,
      yStart: bg.mouse.y,
    }
  }
  bg?.destroy();
  container?.remove();
  initConfig = {};
  bg = container = activeBg = undefined;
}

export const init = (config = initConfig || script?.dataset) => {
  if (container) {
    destroy();
  }

  const bgType = config.bg || 'trail';
  if (!bgMap[bgType]) {
    const errorMsg = `[vi-bg] type ${bgType} not found`;
    if (script) {
      console.error(errorMsg);
      return;
    } {
      throw new Error(errorMsg)
    }
  }
  activeBg = bgType;

  container = document.createElement('div');
  container.classList.add('vi-bg');
  const style = document.createElement('style');
  style.innerHTML = `.vi-bg { ${config.container ? '' : 'position: fixed;'} z-index: -1; top: 0; left: 0; pointer-events: none; }`;
  container.appendChild(style);

  const parent = 'container' in config
  ? typeof config.container !== 'string' && config.container || document.querySelector(config.container)
  : document.body;

  if (!parent) {
    const errorMsg = `[vi-bg] container ${config.container || 'element'} not found`;
    if (script) {
      console.error(errorMsg);
      return;
    } {
      throw new Error(errorMsg)
    }
  }

  parent.insertBefore(container, parent.firstChild);
  parent.style.zIndex = 0;
  parent.style.position = 'relative';

  delete script?.dataset.paused;
  bg = new bgMap[bgType].bg(container, { ...startPos, ...config, bg: bgType });
}

const defaultExport = { paused, pause, play, setConfig, getConfig, getDefaultConfig, init, destroy };

if (document.currentScript) {
  window.vicTrails = defaultExport;
  script = document.currentScript;
} else {
  const src = new URL(import.meta.url);
  script = document.querySelector(`script[src$="${src.href.slice(src.origin.length + 1)}"]`);
}
if (script && typeof script.dataset.paused === 'undefined') {
  init();
} else {
  initConfig = { ...script?.dataset };
}
