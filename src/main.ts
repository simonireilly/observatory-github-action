import * as core from '@actions/core'
import {run} from './index'

try {
  const markdownString = run()
  core.setOutput('observatory-report', markdownString)
} catch (error) {
  core.setFailed(error.message)
}
