import datediff from '../index.js';
import {describe, it} from 'mocha';
import moment from 'moment';
import assert from 'assert';

/**
 * Perform the same calculation as datediff(), but use the moment.js library
 * to ensure an accurate result for testing against.
 *
 * Dates are passed in separately to avoid string splitting/parsing in this process.
 *
 * @param {string} dateString1
 * @param {string} dateString2
 */
const expected = (dateString1, dateString2) => {
	const DATE_FORMAT = 'DD MM YYYY';

	// convert the dates from strings to moment.js dates.
	const date1 = moment(dateString1, DATE_FORMAT);
	const date2 = moment(dateString2, DATE_FORMAT);

	// calculate the difference in days.
	const diff = Math.abs(date1.diff(date2, 'days'));

	// build output string using the correct format.
	return `${moment.min(date1, date2).format(DATE_FORMAT)}, ${moment.max(date1, date2).format(DATE_FORMAT)}, ${diff}`;
};

/**
 * Test two input dates against both functions.
 * @param {string} date1
 * @param {string} date2
 */
const test = (date1, date2) => {
	assert.strictEqual(datediff(`${date1}, ${date2}`), expected(date1, date2));
};

// define the tests themselves.
describe('testing datetime()', () => {

	it('with leading zeroes', () =>
		test('11 11 1918', '01 09 1939'));

	it('without leading zeroes', () =>
		test('1 3 1995', '5 4 2000'));

	it('later date first', () =>
		test('05 07 2008', '06 06 2008'));

	it('two dates one day apart', () =>
		test('24 12 2002', '25 12 2002'));

	it('two dates on the same day', () =>
		test('26 1 2005', '26 1 2005'));

	it('date within earliest possible year', () =>
		test('1 1 1900', '31 12 1900'));

	it('date within latest possible year', () =>
		test('1 1 2010', '31 12 2010'));

	it('nonexistent date (29 Feb in a non-leap year)', () =>
		assert.throws(() => datediff('01 01 2009, 29 2 2009'), Error, 'The date 29 02 2009 does not exist.'));

	it('nonexistent date (31 April)', () =>
		assert.throws(() => datediff('31 04 2000, 30 1 1998'), Error, 'The date 29 02 2009 does not exist.'));


	it('invalid month', () =>
		assert.throws(() => datediff('1 15 2009, 5 15 2009'), Error, 'Month must be between 1–12.'));

	it('invalid day', () =>
		assert.throws(() => datediff('0 12 1991, 5 3 2010'), Error, 'Day must be between 1–31.'));

	it('malformed date', () =>
		assert.throws(() => datediff('1991, 05 10 2002'), Error, 'Ensure that date is in the format DD MM YY.'));

	it('arbitrary text', () =>
		assert.throws(() => datediff('DD MM YY, 20 02 2002'), Error, 'Day must be between 1–31.'));

});
