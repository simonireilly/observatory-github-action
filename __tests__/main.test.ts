import run from '../src/main'

test('run 500 ms', async () => {
  const start = new Date()
  await run()
  const end = new Date()
  var delta = Math.abs(end.getTime() - start.getTime())
  expect(delta).toBeGreaterThan(450)
})
