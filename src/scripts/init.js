import defineElements from './defineElements';

function init(window) {
	/* eslint-disable no-undef */
	const CUSTOM_ELEMENTS = [ DemoClock ];
	/* eslint-enable no-undef */

	window.setTimeout(() => defineElements(window, CUSTOM_ELEMENTS), 1);
}

export default window => {
	window.addEventListener('DOMContentLoaded', () => init(window), { once: true });
};
