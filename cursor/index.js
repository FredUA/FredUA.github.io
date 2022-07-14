import { control, element } from './styles.js'

const DEFAULT_TYPE = 'bubble'; // type of effect (available - bubbles, ripples)
const SETTINGS = {
	AVAILABLE: true, // true/false, allow opening popup with raw settings
	ANIMATION_SPEED: 500, //speed for bubbles animation
	COLOR: 'currentColor', //color for bubbles
}



class LetsAnimateClick extends HTMLElement {
	static get observedAttributes() { return ['type', 'color', 'speed']; } //an array of attributes you need to observe
	constructor() {
		super();
		this.attachShadow({ mode: 'open' }); // attached shadow DOM
	}

	createBodyShadowRoot() { // adding needed elements and style tags
		this.shadowRoot.innerHTML = `
			<style id="control">
			${control()}
			</style>
			<style id="style" class="hidden" contenteditable="true">
			${element(this.speed, this.color)}
			</style>
			<button id="btn-ctrl" class="hidden"></button>
		`;
		this.btnCtrl = this.shadowRoot.getElementById('btn-ctrl');
		this.btnCtrl.addEventListener('click', this.controlHandler);
	}

	connectedCallback() { //fire when element is placed inside the DOM
		this.type = this.getAttribute('type') || DEFAULT_TYPE;
		this.color = this.getAttribute('color') || SETTINGS.COLOR;
		this.speed = this.getAttribute('speed') || SETTINGS.ANIMATION_SPEED;

		this.initIvent();
	}

	disconnectedCallback() {
		console.log('disconnectedCallback');
	}

	initIvent() { // initialization
		this.createBodyShadowRoot();
		document.addEventListener('click', this.clickHandler)
		document.addEventListener('keydown', this.keyPressHandler)
	}

	clickHandler = (e) => {
		const newBubble = document.createElement('span');
		newBubble.className = `el ${this.type}`;
		newBubble.style.setProperty('--x', `${e.x}px`)
		newBubble.style.setProperty('--y', `${e.y}px`);

		this.shadowRoot.appendChild(newBubble);
		this.timer(newBubble);
	}

	controlHandler = (e) => { //allow to render and edit tag style with raw styles
		e.preventDefault();

		if (!SETTINGS.OPENED) { //here we swap style tag to pre for pretify CSS
			const styleElement = this.shadowRoot.getElementById('style');
			SETTINGS.STYLE_EL = styleElement.outerHTML;
			SETTINGS.PRE_EL = SETTINGS.STYLE_EL.replaceAll("<style", "<pre").replaceAll("</style", "</pre");

			styleElement.outerHTML = SETTINGS.PRE_EL;
		} else { // here we return the style tag
			const styleElement = this.shadowRoot.getElementById('style');

			SETTINGS.PRE_EL = styleElement.outerHTML;
			SETTINGS.STYLE_EL = SETTINGS.PRE_EL.replaceAll("<pre", "<style").replaceAll("</pre", "</style");
			styleElement.outerHTML = SETTINGS.STYLE_EL;

			const searchPhrase_1 = '--speed: ';
			const searchPhrase_2 = 'ms';
			const startIndex = SETTINGS.PRE_EL.indexOf(searchPhrase_1) + searchPhrase_1.length;
			const endIndex = SETTINGS.PRE_EL.indexOf(searchPhrase_2);

			this.speed = SETTINGS.PRE_EL.slice(startIndex, endIndex);
		}

		SETTINGS.OPENED = !SETTINGS.OPENED;
	}

	timer = (element) => { //delete bubble
		setTimeout(() => {
			element.remove();
		}, +this.speed);
	}

	keyPressHandler = (event) => { //hot keys for opening style tag
		const fired = event.altKey && event.ctrlKey && event.shiftKey && event.code === 'KeyS' // Ctrl + Alt + Shift + s

		if (fired && SETTINGS.AVAILABLE) { //SETTINGS.AVAILABLE should be true to make it possible 
			this.shadowRoot.getElementById('style').classList.toggle('hidden');
			this.btnCtrl.classList.toggle('hidden');
		}
	}

	attributeChangedCallback(name, _, newValue) { //here we compare value of attributes
		if (newValue === null) {
			return;
		}

		if (name === 'type') {
			this.type = newValue;
		}

		if (name === 'color') {
			this.color = newValue;
		}


		this.createBodyShadowRoot();
	}
}

customElements.define('animated-click', LetsAnimateClick);
/*

1. Баблінг по кліку, чи ефект хвильки - DONE
2. через атрибути задавати параметри анімації - DONE
3. по гарячим клавішам відкривати налаштування для самого  псевдоелемента, давати можливість редагувати і зберігати в LocalStorage - DONE 2/3
4. при перезавантаженні першим ділом йти в локал сторедж і там брати налаштування, якщо немає задавати дефолт

*/