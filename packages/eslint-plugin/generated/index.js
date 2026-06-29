import { readFileSync } from 'fs';
export const RULES = {
    'v-keyboard': ['template', 'body'],
    'scroll-view': ['template', 'body-view', 'dialog', 'navigation-stack', 'navigation-split-view', 'detail-placeholder'],
    dialog: ['template', 'tab-view', 'navigation-split-view'],
    'tool-bar': ['template', 'dialog', 'body-view', 'navigation-split-view', 'navigation-stack'],
    'tool-bar-item': ['template', 'tool-bar', 'tool-bar-item-group', 'sidebar-toggle'],
};
export function validate(tag, getParentTag, allowedParents, context, node) {
    let parentTag = getParentTag(node), isValid = false;
    while (parentTag) {
        if (parentTag.type === node.type && allowedParents.includes(parentTag.name)) {
            isValid = true;
            break;
        }
        parentTag = getParentTag(parentTag);
    }
    if (isValid)
        return;
    context.report({
        // @ts-expect-error
        node,
        messageId: 'disallowedTag',
        data: {
            tag,
            allowed: allowedParents.join(', '),
        },
    });
}
const { name, version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
export const swiftwc = {
    meta: {
        name,
        version,
        namespace: 'swiftwc',
    },
    configs: {},
    rules: {
        'allowed-tags': {
            meta: {
                type: 'problem',
                docs: {
                    description: 'Restrict allowed HTML tags',
                    url: `https://github.com/swiftwc/ui`,
                },
                // languages: ['html/html'],
                schema: [],
                // schema: [
                //   {
                //     type: 'object',
                //     properties: {
                //       allowed: {
                //         type: 'array',
                //         items: { type: 'string' },
                //       },
                //     },
                //     additionalProperties: false,
                //   },
                // ],
                messages: {
                    disallowedTag: 'Tag <{{tag}}> is only allowed inside any of: {{allowed}}',
                },
            },
            // create(context) {
            //   const options = context.options?.[0] || {},
            //     allowed = new Set(options.allowed || [...DEFAULT_ALLOWED])
            //   return {
            //     Tag(node) {
            //       const tag = node.name
            //       if (!allowed.has(tag)) {
            //         context.report({
            //           node,
            //           messageId: 'disallowedTag',
            //           data: {
            //             tag,
            //             allowed: [...allowed].join(', '),
            //           },
            //         })
            //       }
            //     },
            //   }
            // },
            create(context) {
                return {
                    Tag(node) {
                        const tag = node.name;
                        const allowedParents = RULES[tag];
                        if (!allowedParents)
                            return; // 👈 ignore unknown tags completely
                        validate(tag, (item) => item.parent, allowedParents, context, node);
                        // let parent = node.parent
                        // let valid = false
                        // while (parent) {
                        //   if (parent.type === 'Tag' && allowedParents.includes(parent.name)) {
                        //     valid = true
                        //     break
                        //   }
                        //   parent = parent.parent
                        // }
                        // if (!valid) {
                        //   context.report({
                        //     node,
                        //     messageId: 'disallowedTag',
                        //     data: {
                        //       tag,
                        //       allowed: allowedParents.join(', '),
                        //     },
                        //   })
                        // }
                    },
                };
            },
        },
    },
};
Object.assign(swiftwc.configs, {
    recommended: [
        {
            plugins: {
                swiftwc,
            },
            rules: {
                'swiftwc/allowed-tags': 'error', //['error', { allowed: ['div', 'span', 'my-button', 'my-card'] }],
            },
        },
    ],
});
