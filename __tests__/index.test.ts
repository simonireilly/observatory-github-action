import { run, jsonReportToMarkdown } from '../src/index'

jest.setTimeout(10000)

beforeEach(() => {
  process.env.WEB_HOST = 'github.com'
})

describe('run', () => {
  it('with host name', async () => {
    process.env.WEB_HOST = 'github.com'
    const markdownString = await run()
    expect(markdownString).toMatchSnapshot()
  })

  it('with url', async () => {
    process.env.WEB_HOST = 'https://example.com'
    const markdownString = await run()
    expect(markdownString).toMatchSnapshot()
  })
})

describe('jsonReportToMarkdown', () => {
  it('Creates a table for the results', () => {
    const jsonReport = require('./fixtures/json-observatory-report.json')

    const markdown = jsonReportToMarkdown(jsonReport, 'github.com')

    expect(markdown).toMatchSnapshot()
  })
})
