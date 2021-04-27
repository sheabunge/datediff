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
 * @param date1
 * @param date2
 */
const expected = (date1, date2) => {
	const DATE_FORMAT = 'DD MM YYYY';

	// convert the dates from strings to moment.js dates.
	date1 = moment(date1, DATE_FORMAT);
	date2 = moment(date2, DATE_FORMAT);

	// calculate the difference in days.
	const diff = Math.abs(date1.diff(date2, 'days'));

	// build output string using the correct format.
	return `${moment.min(date1, date2).format(DATE_FORMAT)}, ${moment.max(date1, date2).format(DATE_FORMAT)}, ${diff}`;
};

/**
 * Test two input dates against both functions.
 * @param date1
 * @param date2
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

	it('two dates one day apart', () =>
		test('24 12 2002', '25 12 2002'));

	it('two dates on the same day', () =>
		test('26 1 2005', '26 1 2005'));

});
