import { prepareReportData } from "../../../src/tools/report-generator";

import * as fs from "fs";
import * as path from "path";
import jsonReport from "../fixtures/json-observatory-report.json";

describe("processes a json file to a results object", () => {
  it("Creates a table for the results with json", () => {
    const markdown = prepareReportData(jsonReport);

    const [resultRows, score] = prepareReportData(jsonReport);

    expect(score).toEqual(0);
    expect(resultRows).toMatchSnapshot();
  });
  it("processes a text file to a results object", () => {
    const jsonReport = fs.readFileSync(
      path.join(__dirname, "../fixtures/json-observatory-report.txt"),
      "utf8"
    );

    const [resultRows, score] = prepareReportData(jsonReport);

    expect(score).toEqual(0);
    expect(resultRows).toMatchSnapshot();
  });
});
