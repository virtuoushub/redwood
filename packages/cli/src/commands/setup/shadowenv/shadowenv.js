import fs from 'fs'
import path from 'path'

import boxen from 'boxen'
import Listr from 'listr'

import { getPaths, writeFile } from '../../../lib'
import c from '../../../lib/colors'

const shadowenvConfigPath = `${getPaths().base}/.shadowenv.d/rw.lisp`

export const builder = (yargs) => {
  yargs.option('force', {
    alias: 'f',
    default: false,
    description: 'Overwrite existing configuration',
    type: 'boolean',
  })
}

export const handler = async ({ force }) => {
  const tasks = new Listr(
    [
      {
        title: 'Configuring Shadowenv...',
        task: (ctx) => {
          /**
           * Check if Shadowenv config already exists.
           * If it exists, throw an error.
           */
          if (!force && fs.existsSync(shadowenvConfigPath)) {
            ctx.error = true
            throw new Error(
              'Shadowenv config already exists.\nUse --force to override existing config.'
            )
          } else {
            return writeFile(
              shadowenvConfigPath,
              fs
                .readFileSync(
                  path.resolve(__dirname, 'templates', 'rw.lisp.template')
                )
                .toString(),
              { overwriteExisting: force }
            )
          }
        },
      },
      {
        title: 'Destination:',
        enabled: (ctx) => !ctx.error,
        task: (_ctx, task) => {
          task.title = `  Wrote templates to ${shadowenvConfigPath.replace(
            getPaths().base,
            ''
          )}
        `
        },
      },
      {
        title: '',
        enabled: (ctx) => !ctx.error,
        task: (_ctx, task) => {
          task.title = `One more thing...\n\n ${boxen(
            [
              c.green('Installation steps for Shadowenv'),
              'See: https://shopify.github.io/shadowenv/getting-started/',
            ].join('\n   '),
            {
              padding: { top: 1, bottom: 1, right: 1, left: 1 },
              margin: 1,
              borderColour: 'gray',
            }
          )}  \n`
        },
      },
    ],
    { collapse: false, exitOnError: true }
  )

  try {
    await tasks.run()
  } catch (e) {
    console.error(c.error(e.message))
    process.exit(e?.exitCode || 1)
  }
}
