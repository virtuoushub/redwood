import { Plugin } from '@envelop/types'
import { DirectiveNode, GraphQLObjectType, GraphQLResolveInfo } from 'graphql'

export function hasDirective(info: GraphQLResolveInfo): boolean {
  const { parentType, fieldName, schema } = info
  const schemaType = schema.getType(parentType.name) as GraphQLObjectType
  const field = schemaType.getFields()[fieldName]
  const astNode = field.astNode
  // if directives array exists, we check the length
  // other wise false
  return !!astNode?.directives?.length
}

function isQueryOrMutation(info: GraphQLResolveInfo): boolean {
  console.log(info)
  return true
}

export function getDirectiveByName(
  info: GraphQLResolveInfo,
  name: string
): null | DirectiveNode {
  const { parentType, fieldName, schema } = info
  const schemaType = schema.getType(parentType.name) as GraphQLObjectType
  const field = schemaType.getFields()[fieldName]
  const astNode = field.astNode
  const associatedDirective = astNode?.directives?.find(
    (directive) => directive.name.value === name
  )

  return associatedDirective || null
}

// use this to get specific argument values
// e.g. getDirectiveArgument(directive, 'roles')
// will return the roles listed in @requireAuth(roles: ['ADMIN', 'BAZINGA'])
export function getDirectiveArgument(
  directive: DirectiveNode,
  argumentName: string
) {
  if (directive.kind === 'Directive') {
    const directiveArgs = directive.arguments?.filter(
      (d) => d.name.value === argumentName
    )

    if (directiveArgs) {
      // needs improvement
      const outputArgs =
        directiveArgs
          .values()
          .next()
          .value?.value?.values?.map((v: any) => v.value) || undefined

      return outputArgs
    }
  }

  return undefined
}

type ExecuteFn = (
  resolverInfo?: {
    root: unknown
    args: Record<string, unknown>
    info: GraphQLResolveInfo
  },
  directiveNode?: DirectiveNode
) => void | Promise<void>

export type RedwoodDirectivePluginOptions = {
  onExecute: ExecuteFn
  name: string
}

export const useRedwoodDirective = (
  options: RedwoodDirectivePluginOptions
): Plugin<{
  onExecute: ExecuteFn
}> => {
  const executeDirective = options.onExecute

  return {
    onExecute() {
      return {
        async onResolverCalled({ args, root, info }) {
          if (isQueryOrMutation(info) && !hasDirective(info)) {
            throw new Error(
              'You must specify atleast @requireAuth, @skipAuth or a custom directive'
            )
          }

          const directiveNode = getDirectiveByName(info, options.name)

          if (directiveNode) {
            await executeDirective(
              {
                info,
                args,
                root,
              },
              directiveNode
            )
          }
        },
      }
    },
  }

  return {}
}
