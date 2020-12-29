import * as core from '@actions/core'
import { run } from './index'

try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
