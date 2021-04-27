
/**
 * Represents a day, month and year.
 */
class Date {

	/**
	 * Class constructor
	 * @param date Date string, in the format DD MM YYYY.
	 */
	constructor(date) {
		// split the string into its three parts and convert each to a number.
		[this.d, this.m, this.y] = date.split(/\s/).map(n => Number(n));
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

		return `${pad(this.d, 2)} ${pad(this.m, 2)} ${pad(this.y, 4)}`;
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
	 * @return {number}
	 */
	countDays() {
		const EARLIEST_YEAR = 1900; // begin counting years from 1900.
		let days = 0;

		// count up the days from the earliest known year to this date's year.
		for (let year = EARLIEST_YEAR; year < this.y; year++) {
			// leap years have an additional day.
			days += 365 + (Date.isLeapYear(year) ? 1 : 0);
		}

		for (let month = 1; month < this.m; month++) {
			// thirty days hath September, April, June, and November.
			if ([9, 4, 6, 11].includes(month)) {
				days += 30;
			} else if (2 === month) {
				// February has 28, plus an extra during a leap year.
				days += 28 + (Date.isLeapYear(this.y) ? 1 : 0);
			} else {
				// and all the rest have 31.
				days += 31;
			}
		}

		// finally add the day component and return the result.
		return days + this.d - 1;
	}

	/**
	 * Convert the date into a numeric representation.
	 * @return {number}
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
