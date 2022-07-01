import styles from './styles.js'

const DEFAULT_TYPE = 'bubble';
const SETTINGS = {
	AVAILABLE: true, // false prevent opening popup with raw settings
	OPENED: false,
}



class LetsAnimateClick extends HTMLElement {
	static get observedAttributes() { return ['type', 'color']; }
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		console.log(`constructor`);
	}

	connectedCallback() {
		console.log('connectedCallback');
		this.type = this.getAttribute('type') || DEFAULT_TYPE;
		this.color = this.getAttribute('color') || 'currentColor';

		this.shadowRoot.innerHTML = `
			<style id="control">
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
			</style>
			<button id="btn-ctrl" class="hidden"></button>
			<style id="style" class="hidden" contenteditable="true">
				${styles()}
			</style>
			<span class="el ${this.type}"></span>
		`;
		this.el = this.shadowRoot.querySelector('.el');
		this.styleElement = this.shadowRoot.getElementById('style');
		this.btnCtrl = this.shadowRoot.getElementById('btn-ctrl');

		this.initIvent();
	}

	disconnectedCallback() {
		console.log('disconnectedCallback');
	}

	initIvent() {
		document.addEventListener('click', this.clickHandler)

		this.el.addEventListener('animationend', () => {
			this.el.classList.remove('active');
		})

		this.btnCtrl.addEventListener('click', this.controlHandler)

		document.addEventListener('keydown', this.keyPressHandler)
	}

	clickHandler = (e) => {
		this.el.style.setProperty('--x', `${e.x}px`)
		this.el.style.setProperty('--y', `${e.y}px`);

		this.el.classList.add('active');
	}

	controlHandler = (e) => {
		e.preventDefault();

		if (!SETTINGS.OPENED) {
			const styleElement = this.shadowRoot.getElementById('style');
			SETTINGS.STYLE_EL = styleElement.outerHTML;
			SETTINGS.PRE_EL = SETTINGS.STYLE_EL.replaceAll("<style", "<pre").replaceAll("</style", "</pre");
	
			styleElement.outerHTML = SETTINGS.PRE_EL;
		} else {
			const styleElement = this.shadowRoot.getElementById('style');
			SETTINGS.PRE_EL = styleElement.outerHTML;
			SETTINGS.STYLE_EL = SETTINGS.PRE_EL.replaceAll("<pre", "<style").replaceAll("</pre", "</style");
	
			styleElement.outerHTML = SETTINGS.STYLE_EL;
		}

		
		SETTINGS.OPENED = !SETTINGS.OPENED;
	}

	keyPressHandler = (event) => {
		const fired = event.altKey && event.ctrlKey && event.shiftKey && event.code === 'KeyS'

		if (fired) {
			this.shadowRoot.getElementById('style').classList.toggle('hidden');
			this.btnCtrl.classList.toggle('hidden');
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(name, oldValue, newValue);
		if(newValue === null || this.shadowRoot.querySelector('.el') === null) {
			return;
		}

		if(name === 'type' ) {
			this.shadowRoot.querySelector('.el').className = `el ${newValue}`;
		}

		if(name === 'color' ) {
			this.shadowRoot.querySelector('.el').style.setProperty('--color', `${newValue}`);
		}
	}


}

customElements.define('animated-click', LetsAnimateClick);
/*

1. Баблінг по кліку, чи ефект хвильки
2. через атрибути задавати параметри анімації
3. по гарячим клавішам відкривати налаштування для самого псевдоелемента, давати можливість редагувати і зберігати в LocalStorage
4. при перезавантаженні першим ділом йти в локал сторедж і там брати налаштування, якщо немає задавати дефолт

*/