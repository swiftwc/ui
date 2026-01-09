import { kebabCase } from "../internal/utils";

console.log(kebabCase(`Hello client!`));

import { Snapshot } from "../internal/snapshot";

console.log(77, Snapshot);
console.log(88, Snapshot.count);
Snapshot.getSnapshot();
console.log(99, Snapshot);
