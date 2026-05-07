import type { RuleContext, RuleListener } from '@typescript-eslint/utils/ts-eslint';
export type TagNode = {
    name: string;
    parent?: TagNode;
};
export declare const RULES: Record<string, string[]>;
export declare function validate(tag: string, getParentTag: (node: TagNode) => TagNode | undefined, allowedParents: string[], context: RuleContext<string, readonly unknown[]>, node: TagNode): void;
export declare const swiftwc: {
    meta: {
        name: any;
        version: any;
        namespace: string;
    };
    configs: {};
    rules: {
        'allowed-tags': {
            meta: {
                type: "problem";
                docs: {
                    description: string;
                    url: string;
                };
                schema: never[];
                messages: {
                    disallowedTag: string;
                };
            };
            create(context: Readonly<RuleContext<string, readonly unknown[]>>): RuleListener;
        };
    };
};
