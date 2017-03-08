const fs = require('fs');
const Table = require('cli-table2');

module.exports = function(err, data) {
	fs.writeFileSync('scan-nsp.txt', formatLikeSummary(err, data));
};

/**
 * Transform NSP check data into a table like the summary output of nsp check
 * @param  {String} err  Error returned from nsp
 * @param  {Array} data  Data returned from nsp
 * @return {String}      Nicely formatted thing from nsp
 */
function formatLikeSummary(err, data) {
	var returnString = '';
	if (err) {
		if (data) {
			returnString = `(+) Debug output:	${JSON.stringify(Buffer.isBuffer(data) ? data.toString() : data)}\n`;
			return `${returnString}${err}`;
		}
		return `(+) ${err}`;
	}

	if (data.length === 0) {
		return '(+) No known vulnerabilities found';
	}

	var table = new Table({
		head: ['Name', 'Installed', 'Patched', 'Path', 'More Info'],
		style: {
			head: [],
			border: []
 		}
	});

	data.forEach(function (finding) {
		table.push([finding.module, finding.version, finding.patched_versions === '<0.0.0' ? 'None' : finding.patched_versions, finding.path.join(' > '), finding.advisory]);
	});

	returnString += table.toString() + '\n';

	return returnString;
}
