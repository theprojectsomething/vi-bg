import { isTouchDevices } from "./utils";

export class viBg{

  constructor(container, userConfig) {
    this.setConfig(userConfig, false, container);
    this.controller = new AbortController();
    this.container = container;
    const { width, height } = this.rect();
    this.mouse = {
      x: Math.round(width * Math.max(-0.5, Math.min(1.5, this.config.xStart))),
      y: Math.round(height * Math.max(-0.5, Math.min(1.5, this.config.yStart))),
    };
    this.pos = { ...this.mouse };
    this.diff = { x: null,y: null };
    this.tinyCursor = true;
    this.transitionParticles = false;
    this.cursor = false;
    this.mousemoveCursor();
    addEventListener('resize', () => this.init(true), {
      signal: this.controller.signal
    });
  }

  defaultConfig() {
    return {};
  }

  getConfig() {
    return { ...this.config };
  }

  setConfig(userConfig, reload, container) {
    this.config = {
      bg: '',
      xStart: 0.5,
      yStart: 0.5,
      paused: !!this.isPaused,
      ...this.defaultConfig()
    };
    if (!userConfig) {
      return;
    }

    for (const [key, defaultVal] of Object.entries(this.config)) {
      if (!(key in userConfig)) {
        continue;
      }

      const type = typeof defaultVal;
      const val = userConfig[key];
      if (typeof val === type) {
        this.config[key] = val;
      } else if (type === "boolean") {
        this.config[key] = val ? !!+val : true;
      } else if (type === "number" && !isNaN(val)) {
        this.config[key] = +val;
      } else if (type === "string") {
        this.config[key] = val;
      }
    }
    if (reload) {
      this.init(true);
    }
  }

  mousemoveCursor() {
    this.container.parentElement.addEventListener(isTouchDevices ? 'touchmove' : 'mousemove', this.updateCoordinates.bind(this), {
      passive : true,
      signal: this.controller.signal,
    });
  }

  updateCoordinates(e) {
    const { clientX, clientY } = e.type.match('touch') ? e.touches[0] : e;
    const { x, y } = this.rect();
    this.mouse.x = clientX - x;
    this.mouse.y = clientY - y;
  }

  setParamsDiffs(){
    this.diff.x = this.mouse.x - this.pos.x;
    this.diff.y = this.mouse.y - this.pos.y;
    this.pos.x += this.diff.x * this.speed;
    this.pos.y += this.diff.y * this.speed;
  }

  paused() {
    return this.isPaused;
  }

  pause(pause = true){
    this.isPaused = !!pause;
    this.loop();
  }

  play(){
    this.pause(false);
  }

  destroy() {
    this.pause();
    this.controller.abort();
  }

  init(refreshBounds) {
    if (refreshBounds) {
      this.rect(true);
    }

    this.isPaused = this.config.paused;
    this.tinyCursor ? this.setParamsCursor() : null;
    this.setParamsParticles();
    this.drawCursor();
  }

  loop() {
    cancelAnimationFrame(this.nextFrame)
    if (this.isPaused) {
      return;
    }
    this.setParamsDiffs();
    this.tinyCursor ? this.setTinyCursor() : null;
    this.setParticles();
    this.nextFrame = requestAnimationFrame(() => this.loop());
  }


  drawCursor() {
    this.invert = this.sorting === "desc";
    const { width, height } = this.rect();
    this.container.querySelectorAll('svg').forEach(el => el.remove());
    this.container.innerHTML +=
      `<svg
        width="${width}"
        height="${height}"
        viewbox="0 0 ${width} ${height}"
        preserveAspectRatio="${this.preserveAspectRatio || "none"}"
        style="background:${this.backColor || "none"}; cursor:${this.cursor ? "default" : "none"};">
        ${this.gradientParticles ? this.drawGradient() : ''}
        ${this.maskCursor ? this.drawMaskCursor() : this.drawParticles()}
        ${this.drawTinyCursor()}
    </svg>`;
    this.svg = this.container.querySelector('svg');
    this.tinyCursor ? this.nodeCursors = this.container.querySelectorAll('.tiny-cursor circle') : null;
    this.particles = Array.from(this.container.querySelectorAll('.particles circle'));

    this.points = Array(this.nbrParticles).fill().map((el,i) => {
      return {
        node: this.particles[this.invert ? this.nbrParticles - 1 - i : i],
        x: this.pos.x,
        y: this.pos.y,
      }
    });
  }

  drawTinyCursor() {
    return `${this.tinyCursor ?
      `<g class="tiny-cursor">
        <circle
          r=${this.radiusCursorBack || 10}
          cx=${this.pos.x}
          cy=${this.pos.y}
          fill="${this.fillCursorBack || "none"}"
          fill-opacity="${this.fillOpacityCursorBack || 1}"
          stroke="${this.strokeColorCursorBack || "none"}"
          stroke-width="${this.strokeWidthCursorBack || 1}"
          stroke-opacity="${this.strokeOpacityCursorBack || 1}"
          style="transform-origin: ${this.pos.x}px ${this.pos.y}px">
        </circle>
        <circle
          r=${this.radiusCursor || 10}
          cx=${this.pos.x}
          cy=${this.pos.y}
          fill="${this.fillCursor || "white"}"
          fill-opacity="${this.fillOpacityCursor || 1}"
          stroke="${this.strokeColorCursor || "none"}"
          stroke-width="${this.strokeWidthCursor || 0}"
          stroke-opacity="${this.strokeOpacityCursor || 1}"
          style="transform-origin: ${this.pos.x}px ${this.pos.y}px">
        </circle>
     </g>` : ''}`
  }

  setTinyCursor() {
    this.rotate = `rotate(${ Math.atan2(this.diff.y, this.diff.x) * 180 / Math.PI }deg)`;
    this.squeeze = Math.min(Math.sqrt(Math.pow(this.diff.x, 2) + Math.pow(this.diff.y, 2)) / this.accelerator, this.maxSqueeze);
    this.scale = `scale(${1 + this.squeeze},${1 - this.squeeze})`;
    for (const [i,tinyCursor] of this.nodeCursors.entries()) {
      tinyCursor.setAttribute('cx', this.pos.x)
      tinyCursor.setAttribute('cy',this.pos.y)
      tinyCursor.style.transformOrigin = `${this.pos.x}px ${this.pos.y}px`;
      tinyCursor.style.transform = this.rotate + this.scale;
    }
  }

  drawParticles() {
    return `<g class="particles" filter=${this.filterParticles || "none"}>
      ${this.strokeGradient ? `
          <defs>
            <linearGradient id=${this.strokeGradient.idStrokeGradient} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color=${this.strokeGradient.color1} />
              <stop offset="100%" stop-color=${this.strokeGradient.color2} />
            </linearGradient>
          </defs>` : ''}
      ${Array(this.nbrParticles).fill().map((_,i) =>
        `<circle
          r="${this.setRadiusParticles(i)}"
          cx=${this.pos.x} cy=${this.pos.y}
          fill="${this.fillParticles || "none"}"
          fill-opacity="${this.fillOpacityParticles || 1}"
          stroke="${this.strokeGradient ? `url(#${this.strokeGradient.idStrokeGradient})` : this.strokeColorParticles}"
          stroke-width="${this.strokeWidthParticles || 0}"
          stroke-opacity="${this.strokeOpacityParticles || 1}"
          id="${i}">
        </circle>`).join('')}
    </g>`
  }

  setParticles() {
    if (this.transitionParticles) {
      for (const [i,particle] of this.particles.entries()) {
        particle.setAttribute('cx',this.pos.x )
        particle.setAttribute('cy',this.pos.y);
        particle.style.transitionProperty = "cx,cy"
        particle.style.transitionDuration = `${this.transitionParticles.duration+i*this.transitionParticles.delay}ms `;
        particle.style.transitionTimingFunction = this.transitionParticles.easing;
      }
    }
    else {
      this.posTrail = { x: this.pos.x, y : this.pos.y }
      for (const [i,point] of this.points.entries()) {
        this.nextParticle = this.points[i + 1] || this.points[0];
        point.x = this.posTrail.x;
        point.y = this.posTrail.y;
        point.node.setAttribute('cx',this.posTrail.x )
        point.node.setAttribute('cy',this.posTrail.y);
        this.posTrail.x += (this.nextParticle.x - point.x) * (this.delta || 0.9);
        this.posTrail.y += (this.nextParticle.y - point.y) * (this.delta || 0.9);
      }
    }
  }

  setRadiusParticles(index) {
    const i = this.invert ? this.nbrParticles - index - 1 : index;
    this.radius = null;
    if(this.directionRadius === ">"){
      this.radius = this.radiusStart-(i*this.radiusDiff);}
    else{
      this.radius = this.radiusStart+(i*this.radiusDiff);}
    this.radius > 0 ? this.radius = this.radius : this.radius = 0;
    return this.radius;
  }

  rect(forceUpdate) {
    if (!this._rect || forceUpdate) {
      const { x, y, width, height } = this.container.parentElement.getBoundingClientRect();
      this._rect = { x: x + scrollX, y: y + scrollY, width: Math.min(width, innerWidth), height: Math.min(height, innerHeight) };
      this._rect.diag = Math.ceil((this._rect.width ** 2 + this._rect.width ** 2) ** 0.5);
    }
    return this._rect;
  }
}
