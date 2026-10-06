import { createPlugin, getAllowedParents, validate } from '../index.js'

type HtmlNode = { type: 'Tag'; name: string; parent?: { type: string; name?: string } }

const getParentName = (n: HtmlNode) => (n.parent?.type === 'Tag' ? n.parent.name : undefined)

export default createPlugin((context) => ({
  Tag(node: HtmlNode) {
    const allowedParents = getAllowedParents(node.name)
    if (!allowedParents) return

    validate(node.name, getParentName, allowedParents, context, node)
  },
}))
