/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { exec } from '../__fixtures__/exec.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('@actions/exec', () => ({ exec }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Runs brokli with hugo generator', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'generator') return 'hugo'
      if (name === 'drafts') return 'false'
      if (name === 'port') return ''
      return ''
    })

    exec.mockResolvedValueOnce(0)

    await run()

    expect(exec).toHaveBeenCalledWith('npx', ['brokli', 'hugo'])
    expect(core.setOutput).toHaveBeenCalledWith('result', 'success')
    expect(core.info).toHaveBeenCalledWith(
      'Brokli check completed successfully - no broken links found'
    )
  })

  it('Runs brokli with drafts flag', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'generator') return 'hugo'
      if (name === 'drafts') return 'true'
      if (name === 'port') return ''
      return ''
    })

    exec.mockResolvedValueOnce(0)

    await run()

    expect(exec).toHaveBeenCalledWith('npx', ['brokli', 'hugo', '--drafts'])
    expect(core.info).toHaveBeenCalledWith('Including draft posts')
  })

  it('Runs brokli with custom port', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'generator') return 'hugo'
      if (name === 'drafts') return 'false'
      if (name === 'port') return '8080'
      return ''
    })

    exec.mockResolvedValueOnce(0)

    await run()

    expect(exec).toHaveBeenCalledWith('npx', [
      'brokli',
      'hugo',
      '--port',
      '8080'
    ])
    expect(core.info).toHaveBeenCalledWith('Using port: 8080')
  })

  it('Runs brokli with all options', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'generator') return 'hugo'
      if (name === 'drafts') return 'true'
      if (name === 'port') return '3000'
      return ''
    })

    exec.mockResolvedValueOnce(0)

    await run()

    expect(exec).toHaveBeenCalledWith('npx', [
      'brokli',
      'hugo',
      '--drafts',
      '--port',
      '3000'
    ])
    expect(core.setOutput).toHaveBeenCalledWith('result', 'success')
  })

  it('Handles brokli failure', async () => {
    core.getInput.mockImplementation((name: string) => {
      if (name === 'generator') return 'hugo'
      if (name === 'drafts') return 'false'
      if (name === 'port') return ''
      return ''
    })

    exec.mockResolvedValueOnce(1)

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(
      'Brokli check failed - broken links detected'
    )
    expect(core.setOutput).toHaveBeenCalledWith('result', 'failure')
  })

  it('Handles errors', async () => {
    core.getInput.mockImplementation(() => {
      throw new Error('Input error')
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('Input error')
    expect(core.setOutput).toHaveBeenCalledWith('result', 'error')
  })
})
