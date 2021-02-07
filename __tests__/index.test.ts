import { run, jsonReportToMarkdown } from '../src/index'
import jsonReport from './fixtures/json-observatory-report.json'
import * as fs from 'fs'
import * as path from 'path'

jest.setTimeout(20000)

beforeEach(() => {
  process.env.WEB_HOST = 'github.com'
})

describe('run', () => {
  describe('Handles multiple input formats', () => {
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
})

describe('jsonReportToMarkdown', () => {
  it('Creates a table for the results with json', () => {
    const markdown = jsonReportToMarkdown(jsonReport, 'github.com')

    expect(markdown).toMatchSnapshot()
  })
  it('Creates a table for the results with text', () => {
    const jsonReport = fs.readFileSync(
      path.join(__dirname, './fixtures/json-observatory-report.txt'),
      'utf8'
    )

    const markdown = jsonReportToMarkdown(jsonReport, 'github.com')

    expect(markdown).toMatchSnapshot()
  })
})
