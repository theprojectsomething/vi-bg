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

class BgTrail extends viBg {
  constructor(container, userConfig) {
    super(container, userConfig);
    this.speed = !isTouchDevices ? 0.5 : 1;
    this.delta = !isTouchDevices ? 0.04 : 0.04;
    this.cursor = true;
    this.tinyCursor = false;
    this.init();
    this.loop();
  }

  defaultConfig() {
    return defaultConfig;
  }

  setParamsParticles() {
    const length = Math.max(0, Math.min(this.config.length * 3, 3)) ** (isTouchDevices ? 0.5 : 1);
    const size = Math.max(0, Math.min(this.config.size, 3));
    const taper = (Math.max(0, Math.min(this.config.taper, 3)) - 1) * 0.4;
    this.nbrParticles = Math.round(Math.max(1, length * 300));
    this.radiusStart = Math.max(1, this.rect().diag / 15 * size ** 0.5);
    this.radiusDiff = taper < 0 ? (Math.abs(taper) ** 0.5) * -1 : taper ** 0.5;
    this.sorting = this.config.invert || "desc";
    this.idGradient = "gradient";
    this.fillParticles = `url('#${this.idGradient}')`;
    this.gradientParticles = {
      color1: this.config.colourA,
      color2: this.config.colourB
    };
  }

  drawGradient() {
    return `<defs>
      <linearGradient id=${this.idGradient}>
        <stop offset="0%"  stop-color="${this.gradientParticles.color1}" />
        <stop offset="100%" stop-color="${this.gradientParticles.color2}" />
      </linearGradient>
    </defs>`
  }
}

export default { bg: BgTrail, config: defaultConfig };

