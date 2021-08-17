import gql from 'graphql-tag'

import { AuthenticationError, ForbiddenError } from '../errors'
import { context } from '../index'

import { getRoles } from './useRedwoodDirective'
import type { ExecuteFn } from './useRedwoodDirective'

export const REQUIRE_AUTH_SDL = /* GraphQL */ `
  directive @requireAuth(roles: [String]) on FIELD_DEFINITION
`

export const isAuthenticated = () => {
  return !!context.currentUser
}

// @TODO remove this
const _isArray = (input: string | string[] | undefined): input is string[] => {
  return Array.isArray(input)
}

export const hasRole = ({ roles }: any) => {
  if (!isAuthenticated()) {
    return false
  }

  const currentUserInContext = context.currentUser as {
    roles?: string[]
  }

  if (roles) {
    if (_isArray(roles)) {
      return currentUserInContext.roles?.some((role) => roles.includes(role))
    }

    if (typeof roles === 'string') {
      return currentUserInContext.roles?.includes(roles)
    }

    // roles not found
    return false
  }

  return true
}

// onExecute
export const requireAuth: ExecuteFn = (directiveNode) => {
  const roles = getRoles(directiveNode)

  if (!isAuthenticated()) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (!hasRole({ roles })) {
    throw new ForbiddenError(
      `You don't have ${roles?.join(', ')} access to do that.`
    )
  }
}

export const SKIP_AUTH_SDL = /* GraphQL */ `
  directive @skipAuth on FIELD_DEFINITION
`
// onExecute
export const skipAuth = () => {
  return
}

export const schema = gql`
  ${REQUIRE_AUTH_SDL}
  ${SKIP_AUTH_SDL}
`
