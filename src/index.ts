import * as core from '@actions/core';

type JSONReport = {
  [key: string]: unknown;
};

export function jsonReportToMarkdown(
  jsonReport: JSONReport | string,
  sanitizedHostName: string
): string {
  let result;

  if (typeof jsonReport === 'string') {
    const jsonStructure = jsonReport.slice(jsonReport.indexOf('{'));
    if (jsonStructure.length > 0) {
      result = JSON.parse(jsonStructure) as JSONReport;
    } else {
      core.setFailed('Result is empty');
      return '';
    }
  } else {
    result = jsonReport;
  }

  const resultRows: string[] = [];
  let score = 100;

  // Get the keys
  for (const key in result) {
    const { score_modifier = '0', pass, score_description } = result[key];
    const success = Boolean(pass);

    score += parseInt(score_modifier);
    const icon = (showSuccessIcon: boolean): string =>
      showSuccessIcon ? ':green_circle:' : ':red_circle:';
    const message = `${icon(
      success
    )} | ${score_modifier} | ${score_description}`;
    resultRows.push(message);
  }

  return `
## Observatory Results [${sanitizedHostName}](https://${sanitizedHostName}): _${score} of 100_

See the full report: https://observatory.mozilla.org/analyze/${sanitizedHostName}

### Highlights

Passed | Score | Description
--- | --- | ---
${resultRows.join('\n')}
  `;
}
