import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    const webHost: string = core.getInput('web_host')
    core.info(`Preparing Observatory check for ${webHost}`)

    core.debug(new Date().toTimeString())
    await exec.exec('npx observatory-cli', [webHost, '--format=report'])
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
