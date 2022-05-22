import { jsonReportToMarkdown } from "../../../src/tools/report-generator";

import jsonReport from "../fixtures/json-observatory-report.json";
import * as fs from "fs";
import * as path from "path";

describe("jsonReportToMarkdown", () => {
  it("Creates a table for the results with json", () => {
    const markdown = jsonReportToMarkdown(jsonReport, "github.com");

    expect(markdown).toMatchSnapshot();
  });
  it("Creates a table for the results with text", () => {
    const jsonReport = fs.readFileSync(
      path.join(__dirname, "../fixtures/json-observatory-report.txt"),
      "utf8"
    );

    const markdown = jsonReportToMarkdown(jsonReport, "github.com");

    expect(markdown).toMatchSnapshot();
  });
});
