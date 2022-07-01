export default function () {
	return `
:host {
  --x: 0;
  --y: 0;
  --size: 5rem;
  --speed: 0.25s;
  --color: currentColor;
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
  opacity: 0;
}

.bubble {
  color: red;
  transform: translate(-50%, -50%) scale(0);
  background-color: var(--color);
}

.bubble.active {
  animation: bubble var(--speed);
}

.ripple {
 color: lightblue;
  transform: translate(-50%, -50%) scale(1.5);
  outline: 1px solid var(--color);
}

.ripple.active {
  animation: ripple var(--speed);
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
  10% {
    opacity: 1;
  }
  80% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 1;

  }
  100% {
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  }
}
`;
}
