declare const _default: {
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
            create: (context: Readonly<import("@typescript-eslint/utils/ts-eslint").RuleContext<string, readonly unknown[]>>) => import("@typescript-eslint/utils/ts-eslint").RuleListener;
        };
    };
};
export default _default;
