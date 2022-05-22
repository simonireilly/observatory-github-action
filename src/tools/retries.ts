export const runWithRetry = async (
  routineToRetry: () => Promise<number>,
  onExhaustedRetries: (e: unknown) => Promise<void>,
  maxRetries: number,
  baseSeconds = 1.6
) => {
  let attempts = 1;

  const retryRoutine = async (routine: () => Promise<number>): Promise<any> => {
    try {
      await routine();
    } catch (e) {
      if (attempts <= maxRetries) {
        await exponentialSetTimeout(attempts, baseSeconds);

        attempts += 1;

        return retryRoutine(routine);
      } else {
        return onExhaustedRetries(e);
      }
    }
  };

  return retryRoutine(routineToRetry);
};

export const exponentialSetTimeout = async (
  exponent: number,
  baseSeconds: number
) => {
  const exponentialMS = safeMillisecondExponent(exponent, baseSeconds);
  return new Promise((r) => setTimeout(r, 1000 + exponentialMS));
};

export const safeMillisecondExponent = (
  exponent: number,
  baseSeconds: number
): number => {
  return Math.floor(1000 * baseSeconds ** exponent);
};
