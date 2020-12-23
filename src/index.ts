import * as core from '@actions/core'
import * as exec from '@actions/exec'

type JSONReport = {
  [key: string]: {[key: string]: string}
}

export async function run(): Promise<void> {
  const {result, error} = await runObservatory()

  if (error) core.info(error)

  core.info(result)

  const resultObject = JSON.parse(result) as JSONReport

  const markdown = jsonReportToMarkdown(resultObject)

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

  const webHost: string = core.getInput('web_host') || 'example.com'

  await exec.exec(
    'npx',
    ['observatory-cli', webHost, '--format=json', '-z'],
    options
  )

  return {result, error}
}

export function jsonReportToMarkdown(jsonReport: JSONReport): string {
  const resultRows: string[] = []
  let score = 100

  // Get the keys
  for (const key in jsonReport) {
    const {score_modifier = '0', pass, score_description} = jsonReport[key]

    score += parseInt(score_modifier)
    resultRows.push(
      `${
        pass ? ':green_circle:' : ':red_circle:'
      } | ${score_modifier} | ${score_description}`
    )
  }

  return `
## Observatory Results

Passed | Score | Description
--- | --- | ---
${resultRows.join('\n')}
**Total** | ${score}/100 |
  `
}
