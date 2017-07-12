import defineElements from './defineElements';

function init(window) {
	/* eslint-disable no-undef */
	const CUSTOM_ELEMENTS = [ DemoClock ];
	/* eslint-enable no-undef */

	defineElements(window, CUSTOM_ELEMENTS);
}

export default window => {
	// window.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 1, window), { once: true });
	window.document.body.querySelector('button').addEventListener('click', event => {
		event.target.disabled = true;
		init(window);
	}, { once: true });
};
