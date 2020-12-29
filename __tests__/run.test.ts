import { run, runObservatory, jsonReportToMarkdown } from '../src/index'

jest.setTimeout(10000)

describe('run', () => {
  it('returns a full comment from the observatory client', async () => {
    const markdownString = await run()

    expect(markdownString).toMatchSnapshot()
  })
})

describe('jsonReportToMarkdown', () => {
  it('Creates a table for the results', () => {
    const jsonReport = require('./fixtures/json-observatory-report.json')

    const markdown = jsonReportToMarkdown(jsonReport)

    expect(markdown).toMatchSnapshot()
  })
})
