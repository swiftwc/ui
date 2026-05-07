import { RULES, swiftwc, validate } from '../index.js';
swiftwc.rules['allowed-tags'].meta.docs.description = 'Restrict allowed HTML tags';
swiftwc.rules['allowed-tags'].meta.messages.disallowedTag = 'Tag <{{tag}}> is only allowed inside any of: {{allowed}}';
swiftwc.rules['allowed-tags'].create = (context) => {
    return {
        ElementNode(node) {
            // @ts-expect-error
            const tag = node.tag;
            const allowedParents = RULES[tag];
            if (!allowedParents)
                return; // 👈 ignore unknown tags completely
            // @ts-expect-error
            validate(tag, (item) => item.tag, allowedParents, context, node);
        },
    };
};
export default swiftwc;
