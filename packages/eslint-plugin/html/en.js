import { RULES, swiftwc, validate } from '../src/index.js'

swiftwc.rules['allowed-tags'].meta.docs.description = 'Restrict allowed HTML tags'

swiftwc.rules['allowed-tags'].meta.messages.disallowedTag = 'Tag <{{tag}}> is only allowed inside any of: {{allowed}}'

swiftwc.rules['allowed-tags'].create = (context) => {
  return {
    Tag(node) {
      const tag = node.name

      const allowedParents = RULES[tag]
      if (!allowedParents) return // 👈 ignore unknown tags completely

      validate(tag, (item) => item.parent, allowedParents, context, node)
    },
  }
}

export default swiftwc
