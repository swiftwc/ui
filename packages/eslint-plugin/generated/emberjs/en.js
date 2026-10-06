import { createPlugin, getAllowedParents, validate } from '../index.js';
/** Nearest real element ancestor; skips {{#let}}/{{#if}}/{{#each}} blocks, mustaches, text. */
/** This still accepts content-view, div and scroll-view, and rejects Foo, :header, @arg, this.foo and foo.bar. */
function getParentName(n) {
    for (let p = n.parent; p; p = p.parent) {
        if (p.type === 'GlimmerElementNode' && /^[a-z][\w-]*$/.test(p.tag))
            return p.tag;
        if (p.type === 'GlimmerTemplate')
            return 'template';
    }
    return undefined;
}
export default createPlugin((context) => ({
    // '*': (node) => {
    // if('GlimmerElementNode' !== node.type) return
    GlimmerElementNode(node) {
        const allowedParents = getAllowedParents(node.tag);
        if (!allowedParents)
            return;
        validate(node.tag, getParentName, allowedParents, context, node);
    },
}));
