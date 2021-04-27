#!/usr/bin/env node

import datediff from './index.js';

// fetch the command line arguments and join them into a single string.
const input = process.argv.slice(2).join(' ');

// pass the input to datediff(), printing the output to the console.
console.log(datediff(input));
