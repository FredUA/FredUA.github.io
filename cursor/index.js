import { control, element } from './styles.js'

/**
 * @constant
 * @type {object}
 */
const SETTINGS = {
	TYPE: 'bubble', // type of effect (bubbles/ripples)
	AVAILABLE_TO_CHANGE: true, // true/false, allow opening popup with raw settings
	ANIMATION_SPEED: 500, //animation speed
	COLOR: 'currentColor', //color
}

/**
 * Class representing a new DOM element
 * @extends HTMLElement
 */
class AnimatedClick extends HTMLElement {
	/**
	 * @method observedAttributes In a static get observedAttributes method specified which attributes to notice a change for.
	 * @returns {Array}
	 */
	static get observedAttributes() { return ['type', 'color', 'speed']; }

	/**
	 * Create AnimatedClick and attaches shadow DOM
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	/**
	 * @method createBodyShadowRoot creates element structure with needed attributes
	 */
	createBodyShadowRoot() {
		this.shadowRoot.innerHTML = `
			<div>
				<style id="control">
				${control()}
				</style>
				<style id="style" class="hidden" contenteditable="true">
				${element(this.speed, this.color)}
				</style>
				<button id="btn-ctrl" class="hidden"></button>
			</div>
		`;
		this.btnCtrl = this.shadowRoot.getElementById('btn-ctrl');
		this.btnCtrl.addEventListener('click', this.controlHandler);
	}

	/**
	 * @method connectedCallback executes when element is placed inside the DOM
	 */
	connectedCallback() {
		this.type = this.getAttribute('type') || SETTINGS.TYPE;
		this.color = this.getAttribute('color') || SETTINGS.COLOR;
		this.speed = this.getAttribute('speed') || SETTINGS.ANIMATION_SPEED;

		this.initIvent();
	}

	/**
	 * @method disconnectedCallback fires when the element is deleted from the DOM
	 */
	disconnectedCallback() {
		console.log(`${this.nodeName} was deleted from the DOM`);
	}

	/**
	 * @method initIvent addes event listeners when the component is created
	 */
	initIvent() {
		this.createBodyShadowRoot();
		document.addEventListener('click', this.clickHandler)
		document.addEventListener('keydown', this.keyPressHandler)
	}

	/**
	 * @field gets cursor position and attaches animated element to the component
	 * @param {Event} e click event
	 */
	clickHandler = (e) => {
		const newBubble = this.shadowRoot.createElement('span');
		newBubble.className = `el ${this.type}`;
		newBubble.style.setProperty('--x', `${e.x}px`)
		newBubble.style.setProperty('--y', `${e.y}px`);

		this.shadowRoot.appendChild(newBubble);
		this.timer(newBubble);
	}

	/**
	 * @field allows to render and edit tag 'style' with raw styles
	 * @param {Event} e click event
	 */
	controlHandler = (e) => {
		e.preventDefault();

		/**
		 * It allows to open, close, and pretify the control container with element styles. Also it applies styling
		 * accordingly new changes
		 */
		if (!SETTINGS.OPENED) {
			this.shadowRoot.getElementById('style').outerHTML = this.shadowRoot.getElementById('style').outerHTML.replaceAll("<style", "<pre").replaceAll("</style", "</pre")
		} else {
			this.shadowRoot.getElementById('style').outerHTML = this.shadowRoot.getElementById('style').outerHTML.replaceAll("<pre", "<style").replaceAll("</pre", "</style")

			const searchPhrase_1 = '--speed: ';
			const searchPhrase_2 = 'ms';
			const startIndex = this.shadowRoot.getElementById('style').outerHTML.indexOf(searchPhrase_1) + searchPhrase_1.length;
			const endIndex = this.shadowRoot.getElementById('style').outerHTML.indexOf(searchPhrase_2);

			this.speed = this.shadowRoot.getElementById('style').outerHTML.slice(startIndex, endIndex);
		}

		SETTINGS.OPENED = !SETTINGS.OPENED;
	}

	/**
	 * @field deletes animated element 
	 * @param {HTMLElement} element which needed to delete after applied animation
	 */
	timer = (element) => { //delete bubble
		setTimeout(() => {
			element.remove();
		}, +this.speed);
	}

	/**
	 * @field handles opening style element by pressing hotkey (ALT + CTRL + SHIFT + S)
	 * @param {Event} event keydown event
	 */
	keyPressHandler = (event) => { //hot keys for opening style tag
		const fired = event.altKey && event.ctrlKey && event.shiftKey && event.code === 'KeyS' // Ctrl + Alt + Shift + s

		if (fired && SETTINGS.AVAILABLE_TO_CHANGE) { //SETTINGS.AVAILABLE_TO_CHANGE should be true to make it possible 
			this.shadowRoot.getElementById('style').classList.toggle('hidden');
			this.btnCtrl.classList.toggle('hidden');
		}
	}

	/**
	 * @method attributeChangedCallback default method for HTML elements, allowes to detect attribute changes and apply them
	 * @param {string} name name of the attribute
	 * @param {string} _ old value of the attribute
	 * @param {string} newValue new value of the attribute
	 * @return {false} return false if the attribute has empty value
	 */
	attributeChangedCallback(name, _, newValue) {
		if (newValue.trim() === '') {
			return;
		}

		if (name === 'type') {
			this.type = newValue;
		}

		if (name === 'color') {
			this.color = newValue;
		}

		if (name === 'speed' &&
			typeof (+newValue) === 'number' &&
			!isNaN(+newValue) &&
			+newValue > 0) {
			this.speed = newValue;
		}

		this.createBodyShadowRoot();
	}
}

customElements.define('animated-click', AnimatedClick);
/*

1. Баблінг по кліку, чи ефект хвильки - DONE
2. через атрибути задавати параметри анімації - DONE
3. по гарячим клавішам відкривати налаштування для самого  псевдоелемента, давати можливість редагувати і зберігати в LocalStorage - DONE 2/3
4. при перезавантаженні першим ділом йти в локал сторедж і там брати налаштування, якщо немає задавати дефолт

*/