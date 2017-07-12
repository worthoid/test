import defineElements from '../../../src/scripts/defineElements';

const MOCK_CUSTOM_ELEMENT = { is: 'mock-custom-element' };
const MOCK_WINDOW = { customElements: { define: sinon.spy() } };

describe('defineElements', () => {
	it('should call `customElements.define` for each element', () => {
		defineElements(MOCK_WINDOW, [MOCK_CUSTOM_ELEMENT]);

		expect(MOCK_WINDOW.customElements.define).to.have.been.calledOnce;
	});
});
