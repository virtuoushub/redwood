import {
  createGraphQLHandler,
  makeMergedSchema,
  makeServices,
} from '@redwoodjs/api'

import schemas from 'src/graphql/**/*.{js,ts}'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import services from 'src/services/**/*.{js,ts}'
// import directives from 'src/directives/**/*.{js,ts}'

export const handler = createGraphQLHandler({
  loggerConfig: { logger, options: {} },
  schema: makeMergedSchema({
    schemas,
    services: makeServices({ services }),
  }),
  // directives, // @TODO implement
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
