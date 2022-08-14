// Given a JSON report from the runner, it will translate it to markdown
import * as core from "@actions/core";

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

type TableRow = [string, string, string];

export function jsonReportToMarkdown(
  results: TableRow[],
  score: number,
  sanitizedHostName: string
): string {
  return `
## Observatory Results [${sanitizedHostName}](https://${sanitizedHostName}): _${score} of 100_

See the full report: https://observatory.mozilla.org/analyze/${sanitizedHostName}

### Highlights

Passed | Score | Description
--- | --- | ---
${results.map((row) => row.join(" | ")).join("\n")}
  `;
}

export const summarizeJob = async (
  results: TableRow[],
  score: number,
  sanitizedHostName: string
) => {
  await core.summary
    .addHeading(`Observatory Results: ${score} of 100`)
    .addLink(
      `Website scanned: ${sanitizedHostName}`,
      `https://${sanitizedHostName}`
    )
    .addTable([
      [
        { data: "Passed", header: true },
        { data: "Score", header: true },
        { data: "Description", header: true },
      ],
      ...results,
    ])
    .addLink(
      "See the full report",
      `https://observatory.mozilla.org/analyze/${sanitizedHostName}`
    )
    .write();
};

export const prepareReportData = (
  jsonReport: Report | string
): [TableRow[], number] => {
  let result;

  if (typeof jsonReport === "string") {
    const jsonStructure = jsonReport.slice(jsonReport.indexOf("{"));
    if (jsonStructure.length > 0) {
      result = JSON.parse(jsonStructure) as Report;
    } else {
      core.setFailed("Result is empty");
    }
  } else {
    result = jsonReport;
  }

  const resultRows: [string, string, string][] = [];
  const report = result as Report;
  const icon = (showSuccessIcon: boolean): string =>
    showSuccessIcon ? ":green_circle:" : ":red_circle:";

  let score = 100;

  // Get the keys
  for (const key in report) {
    const { score_modifier = 0, pass, score_description } = report[key];
    const success = Boolean(pass);

    score += score_modifier;

    const row: [string, string, string] = [
      icon(success),
      String(score_modifier),
      score_description,
    ];
    resultRows.push(row);
  }

  return [resultRows, score];
};
