const m = require('.');
const fs = require('fs');
const path = require('path');

const readFixtureFile = (file) => {
	return fs.readFileSync(path.join('fixtures', file), {encoding:'utf8'});
};

const readResultFile = () => {
	return fs.readFileSync(path.join(__dirname, 'scan-nsp.txt'), {encoding:'utf8'});
};

describe('Formatting', () => {

	afterEach(() => {
		return fs.unlinkSync('scan-nsp.txt');
	});

	it('Should pretty format a warning', () => {
		const inputData = readFixtureFile('warningsinput.txt');
		const expected = readFixtureFile('warningsexpected.txt');
		const input = [];
		input.push(JSON.parse(inputData));
		m(null, input, null);
		const pretty = readResultFile();
		expect(pretty).toBe(expected);
	});

	it('Should log no warnings', () => {
		const input = [];
		const expected = '(+) No known vulnerabilities found';
		m(null, input, null);
		const pretty = readResultFile();
		expect(pretty).toBe(expected);
	});

	it('Should log an error with no data', () => {
		const input = new Error('Something went wrong!');
		m(input, null, null);
		const pretty = readResultFile();
		const expected = '(+) Error: Something went wrong!';
		expect(pretty).toBe(expected);
	});

	it('Should log an error with data', () => {
		const inputErr = new Error('Something went wrong!');
		const inputData = {example: 'data'};
		m(inputErr, inputData, null);
		const pretty = readResultFile();
		const expected = readFixtureFile('errorwithdata.txt').trim();
		expect(pretty).toBe(expected);
	});
});
