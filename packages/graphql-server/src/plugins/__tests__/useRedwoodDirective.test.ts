import { assertSingleExecutionValue, createTestkit } from '@envelop/testing'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { REQUIRE_AUTH_SDL, SKIP_AUTH_SDL } from '../authDirectives'
import { useRedwoodDirective } from '../useRedwoodDirective'

describe('Directives on Queries', () => {
  let testInstance

  beforeAll(() => {
    const schemaWithDirective = makeExecutableSchema({
      typeDefs: `
      ${REQUIRE_AUTH_SDL}
      ${SKIP_AUTH_SDL}

      type Query {
        protected: String @requireAuth
        public: String @skipAuth
        noDirectiveSpecified: String
      }
      `,
      resolvers: {
        Query: {
          protected: (_root, _args, _context) => 'protected',
          public: (_root, _args, _context) => 'public',
          noDirectiveSpecified: () => 'i should not be returned',
        },
      },
    })

    testInstance = createTestkit(
      [
        useRedwoodDirective({
          onExecute: () => {
            throw new Error('DT says no')
          },
          name: 'requireAuth',
        }),
        useRedwoodDirective({
          onExecute: () => {
            return
          },
          name: 'skipAuth',
        }),
      ],
      schemaWithDirective
    )
  })

  it('Should disallow execution on requireAuth', async () => {
    const result = await testInstance.execute(`query { protected }`)
    assertSingleExecutionValue(result)
    expect(result.errors[0].message).toBe('DT says no')
    expect(result.data?.protected).toBeNull()
  })

  it('Should allow execution on skipAuth', async () => {
    const result = await testInstance.execute(`query { public }`)
    assertSingleExecutionValue(result)
    expect(result.errors).toBeFalsy()
    expect(result.data?.public).toBe('public')
  })
  it('Should not allow execution without a directive', async () => {
    const result = await testInstance.execute(`query { noDirectiveSpecified }`)
    assertSingleExecutionValue(result)
    expect(result.errors[0].message).toBe(
      'You must specify atleast @requireAuth, @skipAuth or a custom directive'
    )
    expect(result.data?.noDirectiveSpecified).toBeNull()
  })
})
