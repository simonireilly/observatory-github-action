import { run } from '../../src/tools/index';

jest.setTimeout(20000);

describe('run', () => {
  describe('Handles multiple input formats', () => {
    it('with host name', async () => {
      const score = await run('github.com');
      expect(score).toEqual(125);
    });
  });
});
