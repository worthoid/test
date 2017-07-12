const templateHTML = `<template class="template-demo-clock">
	<svg viewBox="0 0 32 32" role="img">
		<defs>
			<line class="marker" id="marker-hour" x1="16" x2="16" y2="2"/>
			<line class="marker" id="marker-minute" x1="16" x2="16" y2="1"/>
		</defs>

		<line class="hand hour" x1="16" y1="19" x2="16" y2="7"/>
		<line class="hand minute" x1="16" y1="19" x2="16" y2="2"/>
		<line class="hand second" x1="16" y1="21" x2="16" y2="1"/>
	</svg>
</template>`;

function toLocaleTimeString(date) {
	return date.toLocaleTimeString(document.documentElement.lang || undefined);
}

export { templateHTML, toLocaleTimeString };
