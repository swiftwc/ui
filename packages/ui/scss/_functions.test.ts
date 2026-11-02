import { NodePackageImporter } from 'sass'
import { runSass } from 'sass-true'
import { describe, it } from 'vitest'

runSass({ describe, it }, `${import.meta.dirname}/_functions.test.scss`, {
  loadPaths: [import.meta.dirname],
  importers: [new NodePackageImporter()],
})
