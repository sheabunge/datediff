export const EARLIEST_YEAR = 1900; // begin counting years from 1900.

/**
 * Represents a day, month and year.
 */
export class Date {

	/**
	 * Class constructor
	 * @param {string} date Date string, in the format DD MM YYYY.
	 */
	constructor(date) {
		// split the string into its three parts and convert each to a number.
		const dates = date.split(/\s/);

		if (dates.length !== 3) {
			throw new Error('Ensure that date is in the format DD MM YY.');
		}

		[this.day, this.month, this.year] = dates.map(n => Number(n));
	}

	/**
	 * Retrieve the day number.
	 * @return {int}
	 */
	get day() {
		return this._day;
	}

	/**
	 * Set the day number
	 * @param {int} day Calendar day. Must be between 1–31.
	 */
	set day(day) {
		day = Number(day);

		if (isNaN(day) || day < 1 || day > 31) {
			throw new Error('Day must be between 1–31.');
		}

		this._day = day;
	}

	/**
	 * Retrieve the month number.
	 * @return {int}
	 */
	get month() {
		return this._month;
	}

	/**
	 * Set the day number.
	 * @param {int} month Calendar month. Must be between 1–12.
	 */
	set month(month) {
		month = Number(month);

		if (isNaN(month) || month < 1 || month > 12) {
			throw new Error('Month must be between 1–12.');
		}

		this._month = month;
	}

	/**
	 * Retrieve the year number.
	 * @return {int}
	 */
	get year() {
		return this._year;
	}

	/**
	 * Set the year number.
	 * @param {int} year Calendar year. Cannot be earlier than 1990.
	 */
	set year(year) {
		year = Number(year);

		if (isNaN(year) || year < EARLIEST_YEAR) {
			throw new Error(`Year must be ${EARLIEST_YEAR} or later.`);
		}

		this._year = year;
	}

	/**
	 * Retrieve a string representation of the date, in the format DD MM YY.
	 * @return {string}
	 */
	toString() {
		/** Helper function for padding a number with leading zeros. */
		const pad = (n, width) => {
			n = '' + n; // convert from number to string.
			return '0'.repeat(width - n.length) + n;
		};

		return `${pad(this.day, 2)} ${pad(this.month, 2)} ${pad(this.year, 4)}`;
	}

	/**
	 * Determine whether a given year is a leap year.
	 * @param {int} year
	 */
	static isLeapYear(year) {
		// a leap year occurs whenever the year is divisible by 400, or
		// whenever it is divisible by 4 and not 100.
		return 0 === year % 400 || (0 !== year % 100 && 0 === year % 4);
	}

	/**
	 * Count the total number of days that have passed this year.
	 * @return {int}
	 */
	countDays() {
		let days = 0;

		// count up the days from the earliest known year to this date's year.
		for (let y = EARLIEST_YEAR; y < this.year; y++) {
			// leap years have an additional day.
			days += 365 + (Date.isLeapYear(y) ? 1 : 0);
		}

		// count up the days in the months which have passed so far.
		for (let m = 1; m < this.month; m++) {

			// thirty days hath September, April, June, and November.
			if ([9, 4, 6, 11].includes(m)) {
				days += 30;

			} else if (2 === m) {
				// February has 28, plus an extra during a leap year.
				days += 28 + (Date.isLeapYear(this.year) ? 1 : 0);

			} else {
				// and all the rest have 31.
				days += 31;
			}
		}

		// finally add the day component and return the result.
		return days + this.day - 1;
	}

	/**
	 * Convert the date into a numeric representation.
	 * @return {int}
	 */
	valueOf() {
		return this.countDays();
	}
}

/**
 * Given a pair of dates, calculate the difference between the two dates in days.
 *
 * @param input Input string in the format `DD MM YYYY, DD MM YYYY`
 * @return {string} Output of the form `DD MM YYYY, DD MM YYYY, difference`
 */
export default function datediff(input) {

	// split the input into the two different dates.
	let dates = input.split(',', 2).map(s => s.trim());

	// convert from strings into Date objects.
	dates = dates.map(d => new Date(d));

	// sort so that the earlier date comes first.
	dates.sort((a, b) => a - b);

	// build the output string.
	return `${dates[0]}, ${dates[1]}, ${dates[1] - dates[0]}`;
}
