import defineElements from './defineElements';

function onLoad(window) {
	/* eslint-disable no-undef */
	const CUSTOM_ELEMENTS = [ DemoClock ];
	/* eslint-enable no-undef */

	defineElements(window, CUSTOM_ELEMENTS);
}

export default window => {
	window.addEventListener('DOMContentLoaded', () => onLoad(window), { once: true });
};
