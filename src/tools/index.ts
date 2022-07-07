// Handles configuration, and calling out to the runner
import { runObservatory } from './observatory-runner';
import * as core from '@actions/core';
import { generateReportMeta, renderMarkdownReport } from './report-generator';

const webHost = (): string => {
  return core.getInput('web_host') || 'github.com';
};

export async function run(sanitizedHostName: string): Promise<number> {
  const { result, error } = await runObservatory(sanitizedHostName);

  if (error) core.debug(error);

  core.debug(result);

  const { score, resultRows } = generateReportMeta(result);

  const markdown = renderMarkdownReport({
    sanitizedHostName,
    score,
    resultRows,
  });

  core.setOutput('observatory-report', markdown);
  return score;
}
