import * as core from '@actions/core'
import * as exec from '@actions/exec'

type JSONReport = {
  [key: string]: { [key: string]: string }
}

const webHost: string = core.getInput('web_host') || 'github.com'

export async function run(): Promise<string> {
  let sanitizedHostName = webHost

  try {
    sanitizedHostName = new URL(webHost).host
  } catch (e) {
    core.warning('This is not a valid URL, trying as host name')
    core.error(e)
  }

  core.info(`Running on website: ${sanitizedHostName}`)

  const { result, error } = await runObservatory()

  if (error) core.info(error)

  core.info(result)

  let resultObject: JSONReport
  if (typeof result === 'string') {
    resultObject = JSON.parse(result) as JSONReport
  } else {
    resultObject = result
  }

  const markdown = jsonReportToMarkdown(resultObject)

  core.setOutput('observatory-report', markdown)
  return markdown
}

export async function runObservatory(): Promise<{
  result: string
  error?: string
}> {
  let result = ''
  let error = ''

  const options = {
    listeners: {}
  }

  options.listeners = {
    stdout: (data: Buffer) => {
      result += data.toString()
    },
    stderr: (data: Buffer) => {
      error += data.toString()
    }
  }

  await exec.exec('npx', ['observatory-cli', webHost, '--format=json'], options)

  return { result, error }
}

export function jsonReportToMarkdown(jsonReport: JSONReport): string {
  const resultRows: string[] = []
  let score = 100

  // Get the keys
  for (const key in jsonReport) {
    const { score_modifier = '0', pass, score_description } = jsonReport[key]

    score += parseInt(score_modifier)
    resultRows.push(
      `${pass ? ':green_circle:' : ':red_circle:'
      } | ${score_modifier} | ${score_description}`
    )
  }

  return `
## Observatory Results [${webHost}](https://${webHost}): _${score} of 100_

See the full report: https://observatory.mozilla.org/analyze/${webHost}

### Highlights

Passed | Score | Description
--- | --- | ---
${resultRows.join('\n')}
  `
}
