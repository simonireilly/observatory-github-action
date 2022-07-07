// Given a JSON report from the runner, it will translate it to markdown
import * as core from '@actions/core';

interface Report {
  [key: string]: {
    expectation: string;
    name: string;
    output: {
      [key: string]: unknown;
    };
    pass: boolean;
    result: string;
    score_modifier: number;
    score_description: string;
  };
}

interface ReportMetaData {
  score: number;
  resultRows: string[];
}

export const generateReportMeta = (
  jsonReport: Report | string
): ReportMetaData => {
  let result;

  if (typeof jsonReport === 'string') {
    const jsonStructure = jsonReport.slice(jsonReport.indexOf('{'));
    if (jsonStructure.length > 0) {
      result = JSON.parse(jsonStructure) as Report;
    } else {
      core.setFailed('Result is empty');
      return { score: 0, resultRows: [''] };
    }
  } else {
    result = jsonReport;
  }

  const resultRows: string[] = [];
  const report = result as Report;

  // Baseline score, points will be added or deducted
  let score = 100;

  // Get the keys
  for (const key in report) {
    const { score_modifier = 0, pass, score_description } = report[key];
    const success = Boolean(pass);

    score += score_modifier;
    const icon = (showSuccessIcon: boolean): string =>
      showSuccessIcon ? ':green_circle:' : ':red_circle:';
    const message = `${icon(
      success
    )} | ${score_modifier} | ${score_description}`;
    resultRows.push(message);
  }

  return {
    score,
    resultRows,
  };
};

export const renderMarkdownReport = ({
  sanitizedHostName,
  score,
  resultRows,
}: {
  sanitizedHostName: string;
} & ReportMetaData): string => {
  return `
  ## Observatory Results [${sanitizedHostName}](https://${sanitizedHostName}): _${score} of 100_

  See the full report: https://observatory.mozilla.org/analyze/${sanitizedHostName}

  ### Highlights

  Passed | Score | Description
  --- | --- | ---
  ${resultRows.join('\n')}
    `;
};
