// Handlers spawning a process that runs the observatory CLI
import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function runObservatory(sanitizedHostName: string): Promise<{
  result: string;
  error?: string;
}> {
  let result = '';
  let error = '';

  const options = {
    listeners: {},
  };

  options.listeners = {
    stdout: (data: Buffer) => {
      result += data.toString();
    },
    stderr: (data: Buffer) => {
      error += data.toString();
    },
  };

  try {
    await exec.exec(
      'npx',
      ['observatory-cli', sanitizedHostName, '--format=json', '--attempts=30'],
      options
    );
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }

  core.info(result);
  core.error(error);

  return { result, error };
}
