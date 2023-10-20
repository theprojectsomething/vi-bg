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

class BgWave extends viBg {

  constructor(container, userConfig) {
    super(container, userConfig);
    this.speed = !isTouchDevices ? 0.5 : 1;
    this.init();
    this.loop();
  }

  defaultConfig() {
    return defaultConfig;
  }

  setParamsCursor() {
    this.radiusCursor = 15;
    this.fillCursor = this.config.colourB;
    this.maxSqueeze = 0.6;
    this.accelerator = 1000;
  }

  setParamsParticles() {
    const length = Math.max(0, Math.min(this.config.length, 3)) * 100;
    const size = (Math.max(0, Math.min(this.config.size, 3)) + 1) * 3;
    const taper = (Math.max(0, Math.min(this.config.taper, 3)) + 1) * 6;
    this.strokeGradient = {
      idStrokeGradient : "gradient",
      color1: this.config.colourA,
      color2: this.config.colourB
    }
    this.strokeWidthParticles = size;
    this.strokeOpacityParticles = .15;
    this.radiusDiff = Math.max(1, Math.round(taper));
    this.radiusStart = this.radiusCursor*3;
    this.nbrParticles = Math.round((this.rect().diag + this.radiusDiff - this.radiusStart) / this.radiusDiff);
    this.sorting = this.config.invert && "desc";
    this.transitionParticles = {
      duration: length,
      delay: !isTouchDevices ? 4 : 14,
      easing : "linear"
    };
  }
}

export default { bg: BgWave, config: defaultConfig };


