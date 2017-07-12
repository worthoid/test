class DemoClock extends CustomElementBase { // eslint-disable-line no-undef, no-unused-vars
	constructor() {
		super();

		this.CONTENT_SIZE = 32;
		this.SELECTOR_HAND = '.hand';
		this.SELECTOR_MARKER_HOUR = '#marker-hour';
		this.SELECTOR_MARKER_MINUTE = '#marker-minute';

		this._connected = false;
		this._shouldModifyAttrTabindex = null;
		this._shouldModifyAttrTitle = null;
		this._value = null;
		this._view = null;

		this.addEventListener('click', this._onClick);
		this.addEventListener('keypress', this._onKeyPress);
		this.appendTemplateToShadow();
		this._appendClockMarkers();
	}

	static get is() {
		return 'demo-clock';
	}

	static get observedAttributes() {
		return ['disabled', 'paused'];
	}

	get datetime() {
		const timeElement = this.querySelector('time');

		return timeElement === null ? '' : timeElement.getAttribute('datetime');
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value) {
		this.reflectBooleanPropToAttr('disabled', value);
	}

	get paused() {
		return this.hasAttribute('paused');
	}

	set paused(value) {
		this.reflectBooleanPropToAttr('paused', value);
	}

	get value() {
		return this._value;
	}

	set value(value) {
		this._onPropChangeValue(value);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
		case 'disabled':
			this._onAttrChangeDisabled(newValue);
			break;
		case 'paused':
			this._onAttrChangePaused(newValue);
			break;
		}
	}

	connectedCallback() {
		this._connected = true;
		this._view = this.ownerDocument.defaultView;
		this._updateAttrTabindex(!this.disabled);
		this.setTime(this.getAttribute('value') || this._value);
	}

	disconnectedCallback() {
		this._connected = false;
		this._view = null;
	}

	getTime() {
		return this.textContent;
	}

	setTime(value = null) {
		this.value = value;
	}

	_appendClockMarkers() {
		const hand = this.shadowRoot.querySelector(this.SELECTOR_HAND);
		const svg = this.shadowRoot.querySelector('svg');
		let angle, use;

		for (angle = 0; angle < 360; angle += 6) {
			use = this.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'use');

			if (angle % 30) {
				use.setAttribute('href', this.SELECTOR_MARKER_MINUTE);
			} else {
				use.setAttribute('href', this.SELECTOR_MARKER_HOUR);
			}

			use.setAttribute('transform', `rotate(${ angle }, ${ this.CONTENT_SIZE / 2 }, ${ this.CONTENT_SIZE / 2 })`);
			svg.insertBefore(use, hand);
		}
	}

	_onClick(event) {
		if (this.disabled) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			this.paused = !this.paused;
		}
	}

	_onKeyPress(event) {
		if (event.code ==='Enter' || event.code === 'Space') {
			this.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: this._view }));
		}
	}

	_onAttrChangeDisabled(attrValue) {
		if (this._connected) {
			this._updateAttrTabindex(attrValue === null);
		}
	}

	_onAttrChangePaused(attrValue) {
		if (this._connected && attrValue === null && this._value === null) {
			this._updateClock();
		}
	}

	_onPropChangeValue(value) {
		this._value = value;

		if (this._connected) {
			if (value === null) {
				this._setTime(new Date());
			} else {
				this.paused = true;
				this._setTime(new Date(value));
			}
		}
	}

	_removeAnimationName(element) {
		element.style.animationName = '';
	}

	_resetAnimation(window, element) {
		element.style.animationDelay = '';
		element.style.animationName = 'none';
		window.setTimeout(this._removeAnimationName, 1, element);
	}

	_setTime(date) {
		const timeString = date.toLocaleTimeString(this.ownerDocument.documentElement.lang || undefined);
		let timeElement = this.querySelector('time');

		this._updateAttrTitle(timeString);
		this._updateClock(date);

		if (timeElement === null) {
			timeElement = this.appendChild(this.ownerDocument.createElement('time'));
		}

		timeElement.setAttribute('datetime', date.toJSON());
		timeElement.textContent = timeString;
	}

	_updateAttrTabindex(isTabbable) {
		if (this._shouldModifyAttrTabindex === null) {
			this._shouldModifyAttrTabindex = !this.hasAttribute('tabindex');
		}

		if (this._shouldModifyAttrTabindex) {
			if (isTabbable) {
				this.setAttribute('tabindex', '0');
			} else {
				this.removeAttribute('tabindex');
			}
		}
	}

	_updateAttrTitle(title) {
		if (this._shouldModifyAttrTitle === null) {
			this._shouldModifyAttrTitle = !this.hasAttribute('title');
		}

		if (this._shouldModifyAttrTitle) {
			this.setAttribute('title', 'Time: ' + title);
		}
	}

	_updateClock(date = new Date()) {
		const hands = [...this.shadowRoot.querySelectorAll(this.SELECTOR_HAND)];
		const hrs = date.getHours();
		const secs = date.getSeconds();
		const minsSecs = date.getMinutes() + secs / 60;
		const hrsMinsSecs = (hrs > 11 ? hrs - 12 : hrs) + minsSecs / 60;

		if (this._view) {
			hands.forEach(hand => this._resetAnimation(this._view, hand));

			hands[0].style.animationDelay = `-${ (hrsMinsSecs / 12) * 12 * 60 * 60 }s`;
			hands[1].style.animationDelay = `-${ (minsSecs / 60) * 60 * 60 }s`;
			hands[2].style.animationDelay = `-${ (secs / 60) * 60 }s`;
		}
	}
}
