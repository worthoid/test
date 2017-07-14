/* global DemoClock:false */

import insertHTML from '../../../fixtures/insertHTML';
import { templateHTML, toLocaleTimeString } from './mocks';

const LOCAL_NAME = 'demo-clock';
const OBSERVED_ATTRIBUTES = ['disabled', 'paused'];

const BOOLEAN_ATTRIBUTE_SET = '';
const BOOLEAN_ATTRIBUTE_NOT_SET = null;

const REGEX_LOCALE_TIME = /^\d{1,2}:\d{2}:\d{2}/;
const REGEX_ISO_DATE = /^\d{4}-\d{2}-\d{2}[T]\d{2}:\d{2}:\d{2}/;

describe('DemoClock', () => {
	let demoClock;

	before(() => {
		insertHTML(templateHTML);
	});

	describe('.is', () => {
		it('should return the local name of the element', () => {
			expect(DemoClock.is).to.equal(LOCAL_NAME);
		});

		it('should NOT be writable', () => {
			expect(() => DemoClock.is = 'value').to.throw(TypeError, 'Cannot set property is');
		});
	});

	describe('.observedAttributes', () => {
		it('should return an Array of observed attribute names', () => {
			expect(DemoClock.observedAttributes).to.deep.equal(OBSERVED_ATTRIBUTES);
		});
	});

	describe('when NOT defined', () => {
		describe('constructor()', () => {
			it('should throw an Error', () => {
				expect(document.createElement(LOCAL_NAME).constructor).to.equal(HTMLElement);
				// expect(() => new DemoClock()).to.throw(TypeError, 'Illegal constructor');
			});
		});
	});

	describe('when defined', () => {
		before(done => {
			customElements.define(LOCAL_NAME, DemoClock);
			customElements.whenDefined(LOCAL_NAME).then(() => {
				// demoClock = new DemoClock();
				demoClock = document.createElement(LOCAL_NAME);
				// console.log('DONE');
				done();
			});
		});

		// describe('when unconnected', () => { ??

		describe('constructor()', () => {
			it('should create a custom element', () => {
				expect(demoClock instanceof HTMLElement).to.be.true;
			});
		});

		describe('#datetime', () => {
			it('should return an empty string', () => {
				expect(demoClock.datetime).to.equal('');
			});

			it('should NOT be writable', () => {
				expect(() => demoClock.datetime = 'value').to.throw(TypeError, 'Cannot set property datetime');
			});
		});

		describe('#disabled', () => {
			it('should be `true` when a `disabled` attribute is present', () => {
				demoClock.setAttribute('disabled', '');
				expect(demoClock.disabled).to.be.true;
			});

			it('should be `false` when a `disabled` attribute is NOT present', () => {
				demoClock.removeAttribute('disabled');
				expect(demoClock.disabled).to.be.false;
			});

			it('should add the `disabled` attribute when set to `true`', () => {
				demoClock.disabled = true;
				expect(demoClock.getAttribute('disabled')).to.equal(BOOLEAN_ATTRIBUTE_SET);
			});

			it('should remove the `disabled` attribute when set to `false`', () => {
				demoClock.disabled = false;
				expect(demoClock.getAttribute('disabled')).to.equal(BOOLEAN_ATTRIBUTE_NOT_SET);
			});
		});

		describe('#getTime()', () => {
			before(() => {
				// console.log('DOING');
				demoClock = document.createElement(LOCAL_NAME);
			});

			after(() => {
				document.body.removeChild(demoClock);
			});

			it('should return an empty string when NOT connected', () => {
				expect(demoClock.getTime()).to.equal('');
			});

			it('should return a local time string when connected', () => {
				document.body.appendChild(demoClock);
				// console.log(demoClock.getTime());
				expect(demoClock.getTime()).to.match(REGEX_LOCALE_TIME);
			});
		});

		describe('when connected', () => {
			before(() => {
				// console.log(customElements.get(LOCAL_NAME));
				// console.log(document.createElement(LOCAL_NAME));
				document.body.appendChild(demoClock);
				demoClock = document.body.querySelector(LOCAL_NAME);
			});

			describe('#datetime', () => {
				it('should return an ISO date string', () => {
					expect(demoClock.datetime).to.match(REGEX_ISO_DATE);
				});
			});

			describe('#getTime()', () => {
				it('should return the local time', () => {
					expect(demoClock.getTime()).to.equal(toLocaleTimeString(new Date(demoClock.datetime)));
					document.body.removeChild(demoClock);
				});
			});
		});

		// describe('when disconnected', () => {
	});
});
