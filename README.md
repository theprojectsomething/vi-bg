
# 🍦 VI-BG / visual ice cream background library

A slick, zero-dependancy interactive SVG visualisation / background for your website. A library / fork / ever-so-slight adaptation of the inspiring [marvinx-x/cursors-emitter](https://github.com/marvinx-x/cursors-emitter).

![screenshot](/screenshot.jpg?raw=true "vi-bg demo")
![gallery](/gallery.jpg?raw=true "vi-bg gallery")

[Demo](https://theprojectsomething.github.io/vi-bg/) - Tap the logo to toggle visualisations

[Original article on Codrops](https://tympanus.net/codrops/2022/08/24/custom-svg-cursors-with-an-interactive-emitter-effect/)


## HTML: Quick start

Include the library as a script, directly on your page:

```html
<script src="//cdn.jsdelivr.net/gh/theprojectsomething/vi-bg/dist/vi-bg.umd.js"></script>
```

Optionally, set configuration options via data attributes:

```html
<script
  data-colour-a=#f0f
  data-colour-b=#ff0
  data-size=1
  data-length=0
  bg=wave
  src="//cdn.jsdelivr.net/gh/theprojectsomething/vi-bg/dist/vi-bg.umd.js"
></script>
```


## ESM

### Install + import

Use directly via the CDN:

```js
import * as viBg from "https://cdn.jsdelivr.net/gh/theprojectsomething/vi-bg/dist/vi-bg.js"
```

Or install:

```bash
npm i --save https://github.com/theprojectsomething/vi-bg/tarball/master
```
and local import:

```js
import * as viBg from "vi-bg"
```

### Usage in a module

Unlike script tag usage, the library must be initialised when used inside a module:

```js
viBg.init({
  bg: 'wave',
  colourA: "#f0f",
  colourB: "#ff0",
  size: 1,
  length: 0,
});
```

### Available methods:

- **init ( config?: object )** _=> void_
Initialises the visualisation, optionally accepts a configuration object (see below for options)
- **pause ( )** _=> void_
Pauses the animation
- **play ( )** _=> void_
Plays the animation
- **paused ( )** _=> **true** | **false**_
Returns true if the animation is paused
- **setConfig ( config: object )** _=> void_
Updates the current configuration on the fly or prior to initialisation. Pass an empty object to clear the current config 
- **getConfig ( )** _=> **config: object**_
Returns the current parsed configuration. Prior to initialisation this will only include options that have been set with `setConfig()`
- **getDefaultConfig ( bg?: string = trail | tube | wave )** _=> **config?: object**_
Returns the default configuration for the provided background name. If no name is provided and the visualisation has been initialised, returns the default configuration for the active background
- **destroy ( )** _=> void_
Removes the visualisation, including all dom elements and event listeners



## Configuration

Configuration options can be set on script tags via data attributes, see the [HTML: Quick start](#html-quick-start). For ESM usage, configuration should be set via either the `init()` or `setConfig()` methods, see [ESM: Available methods](#available-methods).

Note: options are listed below in camel case (suitable for ESM). When configuring via data attributes, options should be converted to kebab case, e.g: `colourA` => `data-colour-a`.

- **bg:** _string = **trail** | tube | wave_
Defines the visualisation to show
- **colourA:** _string = **#e3a6f8**_
One of two colours. Accepts any valid colour string, including hex, rgb, shorthand and alpha variations
- **colourB:** _string = **#82f8d9**_
One of two colours. Accepts any valid colour string, including hex, rgb, shorthand and alpha variations
- **size:** _number = [**0-3**] (default value  varies per visualisation)_
Controls one visual dimension; usually a width or radius. Effect varies per visualisation
- **length:** _number = [**0-3**] (default value  varies per visualisation)_
Controls one visual dimension. Effect varies per visualisation
- **taper:** _number = [**0-3**] (default value  varies per visualisation)_
Controls one visual dimension, usually a density or a delta. Effect varies per visualisation
- **invert:** _boolean = **false**_
Reverses the order of the animation. Effect varies per visualisation
- **xStart:** _number = **0.5** [-0.5→1.5]
The starting position of the center of the visualisation, as a ratio of the width of its container (see below). Values smaller than 0 or larger than 1 will position the visualisation outside of the visible container
- **yStart:** _number = **0.5** [-0.5→1.5]
The starting position of the center of the visualisation, as a ratio of the height of its container (see below). Values smaller than 0 or larger than 1 will position the visualisation outside of the visible container.
- **paused:** _boolean = **false**_ 
Use this option to initialise the visualisation in a paused state so it doesn't respond to pointer events
- **container:** _CSS selector | Element = **document.body**_
By default the visualisation will render directly into the body and respond to pointer events on the window. To render the visualisation within a custom container, supply a CSS selector or DOM node. 
_Note: currently only one visualisation can be rendered on the page at a time._



## Credits

- Minor enahncements + library code [theprojectsomething](https://theprojectsomething.com)
- Original code from [Marvinx](https://www.marvinx.com/fr/)
- Design from [Ghislain Auzillon](https://www.ghislainauzillon.com/)


## License
[MIT](LICENSE)
