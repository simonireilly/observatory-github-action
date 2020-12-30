'use strict'

const core = jest.createMockFromModule('@actions/core')

// Allow dependency injection of the HOST name when testing by setting an ENV var
core.getInput = function getInput() {
  return String(process.env.WEB_HOST)
}

module.exports = core
