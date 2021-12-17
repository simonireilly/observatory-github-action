// Handles configuration, and calling out to the runner
import { runObservatory } from './observatory-runner';
import * as core from '@actions/core';
import { jsonReportToMarkdown } from './report-generator';

const webHost = (): string => {
  return core.getInput('web_host') || 'github.com';
};

export async function run(): Promise<string> {
  let sanitizedHostName = webHost();

  try {
    sanitizedHostName = new URL(webHost()).host;
  } catch (e: unknown) {
    core.warning('This is not a valid URL, trying as given string');
    if (e instanceof Error) {
      core.error(e);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }

  core.debug(`Running on website: ${sanitizedHostName}`);

  const { result, error } = await runObservatory(sanitizedHostName);

  if (error) core.debug(error);

  core.debug(result);

  const markdown = jsonReportToMarkdown(result, sanitizedHostName);

  core.setOutput('observatory-report', markdown);
  return markdown;
}
