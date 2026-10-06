import type { RuleContext, RuleListener } from '@typescript-eslint/utils/ts-eslint';
export type BaseNode = {
    type: string;
};
export declare function getAllowedParents(tag: string): string[] | undefined;
export declare function validate<N extends BaseNode>(tag: string, getParentTag: (node: N) => string | undefined, allowedParents: string[], context: RuleContext<string, readonly unknown[]>, node: N): void;
export declare function createPlugin(create: (context: Readonly<RuleContext<string, readonly unknown[]>>) => RuleListener): {
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
            create: (context: Readonly<RuleContext<string, readonly unknown[]>>) => RuleListener;
        };
    };
};
