import { run } from "../../src/tools/index";

jest.setTimeout(20000);

beforeEach(() => {
  process.env.WEB_HOST = "github.com";
});

describe("run", () => {
  describe("Handles multiple input formats", () => {
    it("with host name", async () => {
      process.env.WEB_HOST = "github.com";
      const markdownString = await run();
      expect(markdownString).toMatchSnapshot();
    });

    it("with url", async () => {
      process.env.WEB_HOST = "https://example.com";
      const markdownString = await run();
      expect(markdownString).toMatchSnapshot();
    });
  });
});
