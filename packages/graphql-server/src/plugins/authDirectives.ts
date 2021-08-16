export const REQUIRE_AUTH_SDL = /* GraphQL */ `
  directive @requireAuth(roles: [String]) on FIELD_DEFINITION
`

export const SKIP_AUTH_SDL = /* GraphQL */ `
  directive @skipAuth on FIELD_DEFINITION
`
