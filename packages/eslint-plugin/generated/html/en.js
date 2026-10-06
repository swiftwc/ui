import { createPlugin, getAllowedParents, validate } from '../index.js';
const getParentName = (n) => (n.parent?.type === 'Tag' ? n.parent.name : undefined);
export default createPlugin((context) => ({
    Tag(node) {
        const allowedParents = getAllowedParents(node.name);
        if (!allowedParents)
            return;
        validate(node.name, getParentName, allowedParents, context, node);
    },
}));
