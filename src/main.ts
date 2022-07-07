import * as core from '@actions/core';
import { run } from './tools';

const main = async () => {
  try {
    const scoreRequired = scoreThreshold();
    const host = webHost();

    const score = await run(host);

    if (score < scoreRequired) {
      core.setFailed(
        `Failed on score of '${score}', score must be ${scoreRequired} or greater`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
};

main();

// Private

const scoreThreshold = (): number => {
  const input = core.getInput('score_threshold');
  return parseInt(input) || 100;
};

const webHost = (): string => {
  const host = core.getInput('web_host') || 'github.com';
  let sanitizedHostName = host;

  try {
    sanitizedHostName = new URL(host).host;
  } catch (e: unknown) {
    core.warning('This is not a valid URL, trying as given string');
    if (e instanceof Error) {
      core.error(e);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }

  core.debug(`Running on website: ${sanitizedHostName}`);

  return sanitizedHostName;
};
