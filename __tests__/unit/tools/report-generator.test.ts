import {
  renderMarkdownReport,
  generateReportMeta,
} from '../../../src/tools/report-generator';

import jsonReport from '../fixtures/json-observatory-report.json';
import * as fs from 'fs';
import * as path from 'path';

describe('renderMarkdownReport', () => {
  it('returns the markdown representation of report metadata', () => {
    const result = renderMarkdownReport({
      score: 10,
      resultRows: ['row 1 | thing | part'],
      sanitizedHostName: 'https://example.com',
    });

    expect(result).toMatchSnapshot();
  });
});

describe('jsonReportToMarkdown', () => {
  it('Creates a table for the results with json', () => {
    const markdown = generateReportMeta(jsonReport);

    expect(markdown).toMatchSnapshot();
  });
  it('Creates a table for the results with text', () => {
    const jsonReport = fs.readFileSync(
      path.join(__dirname, '../fixtures/json-observatory-report.txt'),
      'utf8'
    );

    const markdown = generateReportMeta(jsonReport);

    expect(markdown).toMatchSnapshot();
  });
});
