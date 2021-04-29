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

		if (3 !== dates.length) {
			throw new Error('Ensure that date is in the format DD MM YY.');
		}

		[this.day, this.month, this.year] = dates.map(n => Number(n));
	}

	/**
	 * Retrieve the day number.
	 * @return {number} Calendar day.
	 */
	get day() {
		return this._day;
	}

	/**
	 * Set the day number
	 * @param {number} day Calendar day. Must be between 1–31 inclusive.
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
	 * @return {number} Calendar month number.
	 */
	get month() {
		return this._month;
	}

	/**
	 * Set the day number.
	 * @param {number} month Calendar month. Must be between 1–12 inclusive.
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
	 * @return {number} Calendar year.
	 */
	get year() {
		return this._year;
	}

	/**
	 * Set the year number.
	 * @param {number} year Calendar year. Cannot be earlier than 1990.
	 */
	set year(year) {
		year = Number(year);

		if (isNaN(year) || year < EARLIEST_YEAR) {
			throw new Error(`Year must be ${EARLIEST_YEAR} or later.`);
		}

		this._year = year;
	}

	/**
	 * Determine whether a given year is a leap year.
	 * @param {number} year Calendar year.
	 */
	static isLeapYear(year) {
		// a leap year occurs whenever the year is divisible by 400, or
		// whenever it is divisible by 4 and not 100.
		return 0 === year % 400 || (0 !== year % 100 && 0 === year % 4);
	}

	/**
	 * Determine the number of days that should exist in a given month and year.
	 * @param {number} month Month number between 1–12 inclusive.
	 * @param {number} year Calendar year.
	 * @return {number} Number of days in the given month and year.
	 */
	static daysInMonth(month, year) {

		// thirty days hath September, April, June, and November.
		if ([9, 4, 6, 11].includes(month)) {
			return 30;
		}

		// February has 28, plus an extra during a leap year.
		if (2 === month) {
			return 28 + (Date.isLeapYear(year) ? 1 : 0);
		}

		// and all the rest have 31.
		return 31;
	}

	/**
	 * Check if this date is valid (i.e. exists on a calendar).
	 * @return {boolean} true if the date exists, false otherwise.
	 */
	isValidDate() {
		// ensure that the current day is within the valid range.
		return this.day <= Date.daysInMonth(this.month, this.year);
	}

	/**
	 * Retrieve a string representation of the date, in the format DD MM YYYY.
	 * @return {string} Date in the format DD MM YYYY.
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
	 * Count the total number of days that have passed between 1 Jan 1900 and this date.
	 * @return {number} Number of days.
	 */
	countDays() {
		let days = 0;

		// ensure the date is valid before proceeding.
		if (!this.isValidDate()) {
			throw new Error(`The date ${this.toString()} does not exist`);
		}

		// count up the days from the earliest known year to this date's year.
		for (let y = EARLIEST_YEAR; y < this.year; y++) {
			// leap years have an additional day.
			days += 365 + (Date.isLeapYear(y) ? 1 : 0);
		}

		// count up the days in the months which have passed so far.
		for (let m = 1; m < this.month; m++) {
			days += Date.daysInMonth(m, this.year);
		}

		// finally add the day component and return the result.
		return days + this.day - 1;
	}

	/**
	 * Convert the date into a numeric representation.
	 * @return {number} Number of days that have passed between 1 Jan 1900 and this date.
	 */
	valueOf() {
		return this.countDays();
	}
}

/**
 * Given a pair of dates, calculate the difference between the two dates in days.
 *
 * @param {string} input Input string in the format `DD MM YYYY, DD MM YYYY`.
 * @return {string} Output of the form `DD MM YYYY, DD MM YYYY, difference`.
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
