import * as core from '@actions/core';
import { run } from './index';

try {
  run();
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  } else {
    core.setFailed('An unknown error occurred');
  }
}
