(function(a,u){typeof exports=="object"&&typeof module<"u"?u(exports):typeof define=="function"&&define.amd?define(["exports"],u):(a=typeof globalThis<"u"?globalThis:a||self,u(a.viBg={}))})(this,function(a){"use strict";var u=typeof document<"u"?document.currentScript:null;const h="ontouchstart"in window||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0;class y{constructor(i,t){this.setConfig(t,!1,i),this.controller=new AbortController,this.container=i;const{width:s,height:o}=this.rect();this.mouse={x:Math.round(s*Math.max(-.5,Math.min(1.5,this.config.xStart))),y:Math.round(o*Math.max(-.5,Math.min(1.5,this.config.yStart)))},this.pos={...this.mouse},this.diff={x:null,y:null},this.tinyCursor=!0,this.transitionParticles=!1,this.cursor=!1,this.mousemoveCursor(),addEventListener("resize",()=>this.init(!0),{signal:this.controller.signal})}defaultConfig(){return{}}getConfig(){return{...this.config}}setConfig(i,t,s){if(this.config={bg:"",xStart:.5,yStart:.5,paused:!!this.isPaused,...this.defaultConfig()},!!i){for(const[o,f]of Object.entries(this.config)){if(!(o in i))continue;const g=typeof f,l=i[o];typeof l===g?this.config[o]=l:g==="boolean"?this.config[o]=l?!!+l:!0:g==="number"&&!isNaN(l)?this.config[o]=+l:g==="string"&&(this.config[o]=l)}t&&this.init(!0)}}mousemoveCursor(){this.container.parentElement.addEventListener(h?"touchmove":"mousemove",this.updateCoordinates.bind(this),{passive:!0,signal:this.controller.signal})}updateCoordinates(i){const{clientX:t,clientY:s}=i.type.match("touch")?i.touches[0]:i,{x:o,y:f}=this.rect();this.mouse.x=t-o,this.mouse.y=s-f}setParamsDiffs(){this.diff.x=this.mouse.x-this.pos.x,this.diff.y=this.mouse.y-this.pos.y,this.pos.x+=this.diff.x*this.speed,this.pos.y+=this.diff.y*this.speed}paused(){return this.isPaused}pause(i=!0){this.isPaused=!!i,this.loop()}play(){this.pause(!1)}destroy(){this.pause(),this.controller.abort()}init(i){i&&this.rect(!0),this.isPaused=this.config.paused,this.tinyCursor&&this.setParamsCursor(),this.setParamsParticles(),this.drawCursor()}loop(){cancelAnimationFrame(this.nextFrame),!this.isPaused&&(this.setParamsDiffs(),this.tinyCursor&&this.setTinyCursor(),this.setParticles(),this.nextFrame=requestAnimationFrame(()=>this.loop()))}drawCursor(){this.invert=this.sorting==="desc";const{width:i,height:t}=this.rect();this.container.querySelectorAll("svg").forEach(s=>s.remove()),this.container.innerHTML+=`<svg
        width="${i}"
        height="${t}"
        viewbox="0 0 ${i} ${t}"
        preserveAspectRatio="${this.preserveAspectRatio||"none"}"
        style="background:${this.backColor||"none"}; cursor:${this.cursor?"default":"none"};">
        ${this.gradientParticles?this.drawGradient():""}
        ${this.maskCursor?this.drawMaskCursor():this.drawParticles()}
        ${this.drawTinyCursor()}
    </svg>`,this.svg=this.container.querySelector("svg"),this.tinyCursor&&(this.nodeCursors=this.container.querySelectorAll(".tiny-cursor circle")),this.particles=Array.from(this.container.querySelectorAll(".particles circle")),this.points=Array(this.nbrParticles).fill().map((s,o)=>({node:this.particles[this.invert?this.nbrParticles-1-o:o],x:this.pos.x,y:this.pos.y}))}drawTinyCursor(){return`${this.tinyCursor?`<g class="tiny-cursor">
        <circle
          r=${this.radiusCursorBack||10}
          cx=${this.pos.x}
          cy=${this.pos.y}
          fill="${this.fillCursorBack||"none"}"
          fill-opacity="${this.fillOpacityCursorBack||1}"
          stroke="${this.strokeColorCursorBack||"none"}"
          stroke-width="${this.strokeWidthCursorBack||1}"
          stroke-opacity="${this.strokeOpacityCursorBack||1}"
          style="transform-origin: ${this.pos.x}px ${this.pos.y}px">
        </circle>
        <circle
          r=${this.radiusCursor||10}
          cx=${this.pos.x}
          cy=${this.pos.y}
          fill="${this.fillCursor||"white"}"
          fill-opacity="${this.fillOpacityCursor||1}"
          stroke="${this.strokeColorCursor||"none"}"
          stroke-width="${this.strokeWidthCursor||0}"
          stroke-opacity="${this.strokeOpacityCursor||1}"
          style="transform-origin: ${this.pos.x}px ${this.pos.y}px">
        </circle>
     </g>`:""}`}setTinyCursor(){this.rotate=`rotate(${Math.atan2(this.diff.y,this.diff.x)*180/Math.PI}deg)`,this.squeeze=Math.min(Math.sqrt(Math.pow(this.diff.x,2)+Math.pow(this.diff.y,2))/this.accelerator,this.maxSqueeze),this.scale=`scale(${1+this.squeeze},${1-this.squeeze})`;for(const[i,t]of this.nodeCursors.entries())t.setAttribute("cx",this.pos.x),t.setAttribute("cy",this.pos.y),t.style.transformOrigin=`${this.pos.x}px ${this.pos.y}px`,t.style.transform=this.rotate+this.scale}drawParticles(){return`<g class="particles" filter=${this.filterParticles||"none"}>
      ${this.strokeGradient?`
          <defs>
            <linearGradient id=${this.strokeGradient.idStrokeGradient} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color=${this.strokeGradient.color1} />
              <stop offset="100%" stop-color=${this.strokeGradient.color2} />
            </linearGradient>
          </defs>`:""}
      ${Array(this.nbrParticles).fill().map((i,t)=>`<circle
          r="${this.setRadiusParticles(t)}"
          cx=${this.pos.x} cy=${this.pos.y}
          fill="${this.fillParticles||"none"}"
          fill-opacity="${this.fillOpacityParticles||1}"
          stroke="${this.strokeGradient?`url(#${this.strokeGradient.idStrokeGradient})`:this.strokeColorParticles}"
          stroke-width="${this.strokeWidthParticles||0}"
          stroke-opacity="${this.strokeOpacityParticles||1}"
          id="${t}">
        </circle>`).join("")}
    </g>`}setParticles(){if(this.transitionParticles)for(const[i,t]of this.particles.entries())t.setAttribute("cx",this.pos.x),t.setAttribute("cy",this.pos.y),t.style.transitionProperty="cx,cy",t.style.transitionDuration=`${this.transitionParticles.duration+i*this.transitionParticles.delay}ms `,t.style.transitionTimingFunction=this.transitionParticles.easing;else{this.posTrail={x:this.pos.x,y:this.pos.y};for(const[i,t]of this.points.entries())this.nextParticle=this.points[i+1]||this.points[0],t.x=this.posTrail.x,t.y=this.posTrail.y,t.node.setAttribute("cx",this.posTrail.x),t.node.setAttribute("cy",this.posTrail.y),this.posTrail.x+=(this.nextParticle.x-t.x)*(this.delta||.9),this.posTrail.y+=(this.nextParticle.y-t.y)*(this.delta||.9)}}setRadiusParticles(i){const t=this.invert?this.nbrParticles-i-1:i;return this.radius=null,this.directionRadius===">"?this.radius=this.radiusStart-t*this.radiusDiff:this.radius=this.radiusStart+t*this.radiusDiff,this.radius>0?this.radius=this.radius:this.radius=0,this.radius}rect(i){if(!this._rect||i){const{x:t,y:s,width:o,height:f}=this.container.parentElement.getBoundingClientRect();this._rect={x:t+scrollX,y:s+scrollY,width:Math.min(o,innerWidth),height:Math.min(f,innerHeight)},this._rect.diag=Math.ceil((this._rect.width**2+this._rect.width**2)**.5)}return this._rect}}const $={colourA:"#e3a6f8",colourB:"#82f8d9",taper:1,size:2,length:2,invert:!1};class A extends y{constructor(i,t){super(i,t),this.speed=h?1:.5,this.init(),this.loop()}defaultConfig(){return $}setParamsCursor(){this.radiusCursor=15,this.fillCursor=this.config.colourB,this.maxSqueeze=.6,this.accelerator=1e3}setParamsParticles(){const i=Math.max(0,Math.min(this.config.length,3))*100,t=(Math.max(0,Math.min(this.config.size,3))+1)*3,s=(Math.max(0,Math.min(this.config.taper,3))+1)*6;this.strokeGradient={idStrokeGradient:"gradient",color1:this.config.colourA,color2:this.config.colourB},this.strokeWidthParticles=t,this.strokeOpacityParticles=.15,this.radiusDiff=Math.max(1,Math.round(s)),this.radiusStart=this.radiusCursor*3,this.nbrParticles=Math.round((this.rect().diag+this.radiusDiff-this.radiusStart)/this.radiusDiff),this.sorting=this.config.invert&&"desc",this.transitionParticles={duration:i,delay:h?14:4,easing:"linear"}}}const G={bg:A,config:$},P={colourA:"#e3a6f8",colourB:"#82f8d9",taper:1,size:2,length:2,invert:!1};class z extends y{constructor(i,t){super(i,t),this.speed=h?1:.5,this.delta=.04,this.cursor=!0,this.tinyCursor=!1,this.init(),this.loop()}defaultConfig(){return P}setParamsParticles(){const i=Math.max(0,Math.min(this.config.length*3,3))**(h?.5:1),t=Math.max(0,Math.min(this.config.size,3)),s=(Math.max(0,Math.min(this.config.taper,3))-1)*.4;this.nbrParticles=Math.round(Math.max(1,i*300)),this.radiusStart=Math.max(1,this.rect().diag/15*t**.5),this.radiusDiff=s<0?Math.abs(s)**.5*-1:s**.5,this.sorting=this.config.invert||"desc",this.idGradient="gradient",this.fillParticles=`url('#${this.idGradient}')`,this.gradientParticles={color1:this.config.colourA,color2:this.config.colourB}}drawGradient(){return`<defs>
      <linearGradient id=${this.idGradient}>
        <stop offset="0%"  stop-color="${this.gradientParticles.color1}" />
        <stop offset="100%" stop-color="${this.gradientParticles.color2}" />
      </linearGradient>
    </defs>`}}const q={bg:z,config:P},M={colourA:"#e3a6f8",colourB:"#82f8d9",taper:1,size:2,length:2,invert:!1};class D extends y{constructor(i,t){super(i,t),this.speed=h?1:.1,this.init(),this.loop()}defaultConfig(){return M}setParamsCursor(){this.radiusCursorBack=32,this.radiusCursor=16,this.strokeColorCursorBack=this.config.colourB,this.fillCursor=this.config.colourB,this.maxSqueeze=.1,this.accelerator=1e3}setParamsParticles(){const i=Math.max(0,Math.min(this.config.length,3))**(h?.5:1),t=Math.max(0,Math.min(this.config.size,3)),s=Math.max(0,Math.min(this.config.taper,3))+1;this.strokeGradient={idStrokeGradient:"gradient",color2:this.config.colourB,color1:this.config.colourA},this.radiusDiff=t,this.strokeWidthParticles=s,this.strokeOpacityParticles=.2,this.nbrParticles=Math.round(Math.max(1,i*120)),this.directionRadius=">",this.radiusStart=this.rect().diag/3,this.sorting=this.config.invert||"desc",this.transitionParticles={duration:h?100:20,delay:h?4:1,easing:"linear"}}}const O={bg:D,config:M};let e,n,c,d,k,m;const p={wave:G,trail:q,tube:O},v=()=>e==null?void 0:e.paused(),w=()=>e==null?void 0:e.pause(),b=()=>e==null?void 0:e.play(),S=r=>{var i,t;return{...r?(i=p[r])==null?void 0:i.config:(t=p[m])==null?void 0:t.config}},B=()=>(e==null?void 0:e.getConfig())||d,T=r=>{e?e.setConfig(r,!0):d={...r}},x=()=>{e&&(k={xStart:e.mouse.x,yStart:e.mouse.y}),e==null||e.destroy(),c==null||c.remove(),d={},e=c=m=void 0},C=(r=d||(n==null?void 0:n.dataset))=>{c&&x();const i=r.bg||"trail";if(!p[i]){const o=`[vi-bg] type ${i} not found`;if(n){console.error(o);return}throw new Error(o)}m=i,c=document.createElement("div"),c.classList.add("vi-bg");const t=document.createElement("style");t.innerHTML=`.vi-bg { ${r.container?"":"position: fixed;"} z-index: -1; top: 0; left: 0; pointer-events: none; }`,c.appendChild(t);const s="container"in r?typeof r.container!="string"&&r.container||document.querySelector(r.container):document.body;if(!s){const o=`[vi-bg] container ${r.container||"element"} not found`;if(n){console.error(o);return}throw new Error(o)}s.insertBefore(c,s.firstChild),s.style.zIndex=0,s.style.position="relative",n==null||delete n.dataset.paused,e=new p[i].bg(c,{...k,...r,bg:i})},R={paused:v,pause:w,play:b,setConfig:T,getConfig:B,getDefaultConfig:S,init:C,destroy:x};if(document.currentScript)window.vicTrails=R,n=document.currentScript;else{const r=new URL(typeof document>"u"&&typeof location>"u"?require("url").pathToFileURL(__filename).href:typeof document>"u"?location.href:u&&u.src||new URL("vi-bg.umd.cjs",document.baseURI).href);n=document.querySelector(`script[src$="${r.href.slice(r.origin.length+1)}"]`)}n&&typeof n.dataset.paused>"u"?C():d={...n==null?void 0:n.dataset},a.destroy=x,a.getConfig=B,a.getDefaultConfig=S,a.init=C,a.pause=w,a.paused=v,a.play=b,a.setConfig=T,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});
