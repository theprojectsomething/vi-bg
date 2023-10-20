import { isTouchDevices } from "./../utils";
import { viBg } from "./../vi-bg";

const defaultConfig = {
  colourA: "#e3a6f8",
  colourB: "#82f8d9",
  taper: 1,
  size: 2,
  length: 2,
  invert: false,
};

class BgTube extends viBg{

  constructor(container, userConfig) {
    super(container, userConfig);
    this.speed = !isTouchDevices ? 0.1 : 1;
    this.init();
    this.loop();
  }

  defaultConfig() {
    return defaultConfig;
  }

  setParamsCursor() {
    this.radiusCursorBack = 32;
    this.radiusCursor = 16;
    this.strokeColorCursorBack = this.config.colourB
    this.fillCursor = this.config.colourB;
    this.maxSqueeze = 0.1;
    this.accelerator = 1000;
  }

  setParamsParticles() {
    const length = Math.max(0, Math.min(this.config.length, 3)) ** (isTouchDevices ? 0.5 : 1);
    const size = Math.max(0, Math.min(this.config.size, 3));
    const taper = Math.max(0, Math.min(this.config.taper, 3)) + 1;
    this.strokeGradient = {
      idStrokeGradient : "gradient",
      color2 : this.config.colourB,
      color1 : this.config.colourA,
    }
    this.radiusDiff = size;
    this.strokeWidthParticles = taper;
    this.strokeOpacityParticles = .2;
    this.nbrParticles = Math.round(Math.max(1, length * 120));
    this.directionRadius = ">";
    this.radiusStart = this.rect().diag / 3;
    this.sorting = this.config.invert || "desc";
    this.transitionParticles = {
      duration: !isTouchDevices ? 20 : 100,
      delay: !isTouchDevices ? 1 : 4,
      easing : "linear"
    };
  }
}

export default { bg: BgTube, config: defaultConfig };
