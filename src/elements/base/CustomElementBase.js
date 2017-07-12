class CustomElementBase extends HTMLElement { // eslint-disable-line no-unused-vars
	appendTemplateToShadow(mode = 'open') {
		// NOTE: using alternative template selection method while using Vulcanize
		const template = this.ownerDocument.body.querySelector('.template-' + this.localName);
		// const link = this.ownerDocument.querySelector(`link[rel="import"][href*="${ this.localName }"]`);
		// const template = link.import.querySelector('template');

		this.attachShadow({ mode }).appendChild(this.ownerDocument.importNode(template.content, true));
	}

	reflectBooleanPropToAttr(name, value) {
		if (value) {
			this.setAttribute(name, '');
		} else {
			this.removeAttribute(name);
		}
	}
}
