import { readFileSync } from 'fs';
const DIRECT_PARENT_RULES = {
    'v-keyboard': ['template', 'body'],
    'scroll-view': ['template', 'content-view', 'dialog', 'navigation-stack', 'navigation-split-view', 'detail-placeholder'],
    dialog: ['template', 'tab-view', 'navigation-split-view'],
    'tool-bar': ['template', 'dialog', 'content-view', 'navigation-split-view', 'navigation-stack'],
    'tool-bar-item': ['template', 'tool-bar', 'tool-bar-item-group', 'sidebar-toggle'],
    'sidebar-toggle': ['template', 'tab-view', 'form', 'navigation-split-view', 'tool-bar'],
    'content-view': ['template', 'dialog', 'content-view', 'navigation-stack', 'navigation-split-view'],
};
export function getAllowedParents(tag) {
    return Object.hasOwn(DIRECT_PARENT_RULES, tag) ? DIRECT_PARENT_RULES[tag] : undefined;
}
export function validate(tag, getParentTag, allowedParents, context, node) {
    const parent = getParentTag(node);
    if (parent && allowedParents.includes(parent))
        return;
    context.report({
        node: node,
        messageId: 'disallowedTag',
        data: {
            tag,
            allowed: allowedParents.join(', '),
        },
    });
}
const { name, version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
export function createPlugin(create) {
    const plugin = {
        meta: { name, version, namespace: 'swiftwc' },
        configs: {},
        rules: {
            'allowed-tags': {
                meta: {
                    type: 'problem',
                    docs: { description: 'Restrict allowed HTML tags', url: 'https://github.com/swiftwc/ui' },
                    schema: [],
                    messages: { disallowedTag: 'Tag <{{tag}}> is only allowed inside any of: {{allowed}}' },
                },
                create,
            },
        },
    };
    Object.assign(plugin.configs, {
        recommended: [{ plugins: { swiftwc: plugin }, rules: { 'swiftwc/allowed-tags': 'error' } }],
    });
    return plugin;
}
