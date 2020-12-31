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
    core.warning('This is not a valid URL, trying as given string')
    core.error(e)
  }

  core.debug(`Running on website: ${sanitizedHostName}`)

  const { result, error } = await runObservatory(sanitizedHostName)

  if (error) core.debug(error)

  core.debug(result)

  const markdown = jsonReportToMarkdown(result, sanitizedHostName)

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

  try {
    await exec.exec(
      'npx',
      ['observatory-cli', sanitizedHostName, '--format=json', '--attempts=30'],
      options
    )
  } catch (e) {
    core.setFailed(e.message)
  }

  core.info(result)
  core.error(error)

  return { result, error }
}

export function jsonReportToMarkdown(
  jsonReport: JSONReport | string,
  sanitizedHostName: string
): string {
  let result

  if (typeof jsonReport === 'string') {
    const jsonStructure = jsonReport.slice(jsonReport.indexOf('{'))
    if (jsonStructure.length > 0) {
      result = JSON.parse(jsonStructure) as JSONReport
    } else {
      core.setFailed('Result is empty')
      return ''
    }
  } else {
    result = jsonReport
  }

  const resultRows: string[] = []
  let score = 100

  // Get the keys
  for (const key in result) {
    const { score_modifier = '0', pass, score_description } = result[key]
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
