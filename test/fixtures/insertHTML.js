export default (html, parent = document.body, reference = parent.firstChild) => {
	const frag = document.createDocumentFragment();
	const temp = document.createElement('div');

	temp.innerHTML = html;

	while (temp.firstChild) {
		frag.appendChild(temp.firstChild);
	}

	parent.insertBefore(frag, reference);
};
