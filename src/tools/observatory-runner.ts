// Handlers spawning a process that runs the observatory CLI
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { runWithRetry } from "./retries";

export async function runObservatory(
  sanitizedHostName: string,
  maxRetries = 5
): Promise<{
  result: string;
  error?: string;
}> {
  // Setup scoped streams for piping into all attempts
  let result = "";
  let error = "";

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

  await runWithRetry(
    () => runTool(sanitizedHostName, options),
    handleExhaustedRetries,
    maxRetries
  );

  core.info(result);
  core.error(error);

  return { result, error };
}

// Private helpers

const handleExhaustedRetries = async (e: unknown) => {
  if (e instanceof Error) {
    core.setFailed(e.message);
  } else {
    core.setFailed("An unknown error occurred");
  }
};

const runTool = async (
  sanitizedHostName: string,
  options: exec.ExecOptions
) => {
  return exec.exec(
    "node",
    [
      "node_modules",
      "observatory-cli",
      "index.js",
      sanitizedHostName,
      "--format=json",
      "--attempts=30",
    ],
    options
  );
};
