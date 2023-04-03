/**
 * @function control Return the styles for #control element
 * @returns {string}
 */
const control = () => {
  return `
*,
*::before,
*::after {
box-sizing: border-box;
}
#btn-ctrl,
#style {
  --style-gap: 10px;
  --style-width: 250px;
}
#style {
  position: fixed;
  inset: auto var(--style-gap) var(--style-gap) auto;
  opacity: 0;
  width: var(--style-width);
  height: 350px;
  z-index: 10;
  overflow: auto;
  margin: 0;
  box-shadow: 0 0 100vmax rgba(0, 0, 0, 0.5), 0 0 2rem rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding-block: 5px;
  padding-inline: 5px;
  visibility: visible;
  transition: 0.15s linear;
  transition-property: opacity;
}
#btn-ctrl {
  all: unset;
  background-color: #fff;
  font-variant-caps: small-caps;
  padding: 5px 10px;
  outline: 2px solid lightseagreen;
  border-radius: 2px;
  cursor: pointer;
  position: fixed;
  inset: auto calc(var(--style-width) + var(--style-gap) + 10px) var(--style-gap) auto;
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: bolder;
  transition: 0.15s linear;
  transition-property: color, opacity, outline-color;
  visibility: visible;
  opacity: 0;
  color: blueviolet;
}
#btn-ctrl:not(.hidden),
#style:not(.hidden) {
  pointer-events: all;
  opacity: 1;
  display: inline-block;
}
#btn-ctrl:hover {
  color: darkmagenta;
  outline-color: hotpink
}
#btn-ctrl::before {
  content: 'Pretify';
#btn-ctrl.pre::before {
  content: 'Save';
}
#btn-ctrl.hidden {
  background-color: #e2e2e2;
}
  `
}

/**
 * @function element Return the styles for #element animated element
 * @param {string} speed 
 * @param {string} color 
 * @returns {string}
 */
const element = (speed, color) => {
  return `
:host {
  --x: 0;
  --y: 0;
  --size: 5rem;
  --speed: ${speed}ms;
  --color: ${color};
  visibility: hidden;
  position: fixed;
  pointer-events: none;
  inset: 0;
  overflow: hidden;
}
.el {
  content: '';
  display: inline-block;
  width: var(--size);
  aspect-ratio: 1 / 1;
  position: absolute;
  visibility: visible;
  inset: var(--y) auto auto var(--x);
  border-radius: 50%;
  animation-duration: var(--speed);
  will-change: auto;
}

.bubble {
  color: red;
  transform: translate(-50%, -50%) scale(0);
  background-color: var(--color);
  animation-name: bubble;
}

.ripple {
  color: lightblue;
  transform: translate(-50%, -50%) scale(1.5);
  outline: 1px solid var(--color);
  animation-name: ripple;
}

@keyframes bubble {
  25% {
    opacity: 0.5;
  }
  100% {
  transform: translate(-50%, -50%) scale(1);
  opacity: 0;
  }
}

@keyframes ripple {
  o% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  40% {
  }
  100% {
    transform: translate(-50%, -50%) scale(0);
  }
}
  `
}

export {
  control,
  element
}