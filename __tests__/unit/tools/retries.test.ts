import {
  runWithRetry,
  safeMillisecondExponent,
} from "../../../src/tools/retries";

jest.setTimeout(20000);

describe("retries module", () => {
  describe("safeMillisecondExponent", () => {
    const cases = [
      [2, 2560],
      [3, 4096],
      [4, 6553],
      [5, 10485],
    ];
    test.each(cases)(
      "given %p and %p as arguments, returns %p",
      (firstArg, expectedResult) => {
        const result = safeMillisecondExponent(firstArg, 1.6);
        expect(result).toEqual(expectedResult);
      }
    );
  });

  describe("run with retries", () => {
    const cases = [
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
    ];

    test.each(cases)(
      "given %p it retries %p",
      async (maxAttempts, expectedRetries) => {
        const routineToRetry = jest.fn();
        const error = new Error("Throwing causes retries");
        routineToRetry.mockImplementation(() => {
          throw error;
        });
        const handleExhaustedRetries = jest.fn();

        const result = await runWithRetry(
          routineToRetry,
          handleExhaustedRetries,
          maxAttempts,
          0.1
        );

        expect(routineToRetry).toHaveBeenCalledTimes(expectedRetries);
        expect(handleExhaustedRetries).toHaveBeenCalled();
        expect(handleExhaustedRetries).toHaveBeenCalledWith(error);
      }
    );
  });
});
