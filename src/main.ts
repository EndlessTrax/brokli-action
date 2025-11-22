import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const generator: string = core.getInput('generator', { required: true })
    const drafts: string = core.getInput('drafts')
    const port: string = core.getInput('port')

    core.info(`Running brokli for ${generator} static site generator`)

    // Build the brokli command
    const args: string[] = [generator]

    // Add optional flags
    if (drafts === 'true') {
      args.push('--drafts')
      core.info('Including draft posts')
    }

    if (port) {
      args.push('--port', port)
      core.info(`Using port: ${port}`)
    }

    // Execute brokli command
    const exitCode = await exec.exec('npx', ['brokli', ...args])

    if (exitCode === 0) {
      core.setOutput('result', 'success')
      core.info('Brokli check completed successfully - no broken links found')
    } else {
      core.setFailed('Brokli check failed - broken links detected')
      core.setOutput('result', 'failure')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
      core.setOutput('result', 'error')
    }
  }
}
