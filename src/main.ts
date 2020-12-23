import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  let myOutput = ''
  let myError = ''

  const options = {
    listeners: {}
  }
  options.listeners = {
    stdout: (data: Buffer) => {
      myOutput += data.toString()
    },
    stderr: (data: Buffer) => {
      myError += data.toString()
    }
  }

  try {
    const webHost: string = core.getInput('web_host') || 'github.com'
    core.info(`Preparing Observatory check for ${webHost}`)

    core.debug(new Date().toTimeString())
    await exec.exec(
      'npx',
      ['observatory-cli', webHost, '--format=report'],
      options
    )
    core.debug(new Date().toTimeString())

    core.info(myOutput)
    core.setOutput('observatory-report', myOutput)
  } catch (error) {
    core.error(myError)
    core.setFailed(error.message)
  }
}

export default run
