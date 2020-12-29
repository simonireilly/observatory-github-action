import * as core from '@actions/core'
import * as exec from '@actions/exec'

type JSONReport = {
  [key: string]: { [key: string]: string }
}

const webHost = (): string => {
  return core.getInput('web_host') || 'github.com'
}

export async function run(): Promise<string> {
  let sanitizedHostName = webHost()

  try {
    sanitizedHostName = new URL(webHost()).host
  } catch (e) {
    core.warning('This is not a valid URL, trying as host name')
    core.error(e)
  }

  core.info(`Running on website: ${sanitizedHostName}`)

  const { result, error } = await runObservatory(sanitizedHostName)

  if (error) core.info(error)

  core.info(result)

  let resultObject: JSONReport
  if (typeof result === 'string') {
    resultObject = JSON.parse(result) as JSONReport
  } else {
    resultObject = result
  }

  const markdown = jsonReportToMarkdown(resultObject, sanitizedHostName)

  core.setOutput('observatory-report', markdown)
  return markdown
}

export async function runObservatory(
  sanitizedHostName: string
): Promise<{
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

  await exec.exec(
    'npx',
    ['observatory-cli', sanitizedHostName, '--format=json'],
    options
  )

  return { result, error }
}

export function jsonReportToMarkdown(
  jsonReport: JSONReport,
  sanitizedHostName: string
): string {
  const resultRows: string[] = []
  let score = 100

  // Get the keys
  for (const key in jsonReport) {
    const { score_modifier = '0', pass, score_description } = jsonReport[key]
    const success = Boolean(pass)

    score += parseInt(score_modifier)
    const icon = (showSuccessIcon: boolean): string =>
      showSuccessIcon ? ':green_circle:' : ':red_circle:'
    const message = `${icon(
      success
    )} | ${score_modifier} | ${score_description}`
    resultRows.push(message)
  }

  return `
## Observatory Results [${sanitizedHostName}](https://${sanitizedHostName}): _${score} of 100_

See the full report: https://observatory.mozilla.org/analyze/${sanitizedHostName}

### Highlights

Passed | Score | Description
--- | --- | ---
${resultRows.join('\n')}
  `
}
