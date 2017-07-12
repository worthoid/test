export default (window, elements) => {
	elements.forEach(element => window.customElements.define(element.is, element));
};
