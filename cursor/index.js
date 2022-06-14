const DEFAULT_TYPE = 'bubble';



class LetsAnimateClick extends HTMLElement {
	constructor() {
		super();
		console.dir(this);

		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.type = this.getAttribute('type') || DEFAULT_TYPE;

		this.shadowRoot.innerHTML = `
			<style>
				:host {
					--x: 0;
					--y: 0;
					visibility: hidden;
					position: fixed;
					pointer-events: none;
					inset: 0;
					overflow: hidden;
				}

				.el {
					content: '';
					display: inline-block;
					width: 5rem;
					aspect-ratio: 1 / 1;
					position: absolute;
					visibility: visible;
					inset: var(--y) auto auto var(--x);
					border-radius: 50%;
					opacity: 0;
				}
				
				.bubble {
					transform: translate(-50%, -50%) scale(0);
					background-color: red;
				}
				
				.bubble.active {
					animation: bubble 0.35s;
				}
				
				.ripple {
					transform: translate(-50%, -50%) scale(1.5);
					outline: 1px solid lightblue;
				}
				
				.ripple.active {
					animation: ripple 0.5s;
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
			</style>
			<span class="el ${this.type}"></span>
		`;
		this.el = this.shadowRoot.querySelector('.el');

		this.initIvent();
	}

	initIvent() {
		document.addEventListener('click', (e) => {
			this.el.style.setProperty('--x', `${e.x}px`)
			this.el.style.setProperty('--y', `${e.y}px`);

			this.el.classList.add('active');
		})

		this.el.addEventListener('animationend', () => {
			this.el.classList.remove('active');
		})
	}

	attributeChangedCallback() {

	}


}

customElements.define('animated-click', LetsAnimateClick);

/*

1. Баблінг по кліку, чи ефект хвильки
2. через атрибути задавати параметри анімації
3. по гарячим клавішам відкривати налаштування для самого псевдоелемента, давати можливість редагувати і зберігати в LocalStorage
4. при перезавантаженні першим ділом йти в локал сторедж і там брати налаштування, якщо немає задавати дефолт

*/