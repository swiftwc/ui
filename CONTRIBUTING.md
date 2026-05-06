# Contributing

Thanks for your interest in contributing to ui.shadcn.com. We’re happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to reach out to [swiftui-wc@proton.me](mailto:swiftui-wc@proton.me).

## About this repository

This repository is a monorepo.

- We use [pnpm](https://npmjs.com) and [`workspaces`](https://docs.npmjs.com/cli/v8/using-npm/workspaces) for development.

## Structure

This repository is structured as follows:

```
apps
├── docs
└── v1
packages
├── ui
│   ├── custom-elements
│   ├── js
│   │   ├── client
│   │   └── components
│   ├── scss
│   └── web-components.html-data
└── eslint-plugin
```

| Path                     | Description                              |
| ------------------------ | ---------------------------------------- |
| `apps/docs`              | The documentation website.               |
| `apps/v1`                | The living standard app for development. |
| `packages/ui`            | The `swiftwc` package.                   |
| `packages/eslint-plugin` | The ESLint package.                      |

## Development

### Fork this repo

You can fork this repo by clicking the fork button in the top right corner of this page.

### Clone on your local machine

```bash
git clone https://github.com/your-username/ui.git
```

### Navigate to project directory

```bash
cd packages/ui
```

### Create a new Branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
npm install -w @swiftwc/ui
```

#### Examples

1. To run the `v1` website:

```bash
npm run dev -w @swiftwc/v1
npm run dev:scss -w @swiftwc/v1
```

2. To run the `ui` package:

```bash
npm run build -w @swiftwc/ui
```

## Documentation

The documentation for this project is located in the `docs` workspace. You can run the documentation locally by running the following command:

```bash
npm run dev -w @swiftwc/docs
```

Documentation is written using [VitePress](https://vitepress.dev). You can find the documentation files in the `apps/docs` directory.

## Components

We use a registry system for developing components. You can find the source code for the components under `packages/ui/js/components`. The styles for the components are under `packages/ui/scss/components`.

```bash
packages
└── ui
    ├── js
    │   └── components
    └── scss
        └── components
```

When adding or modifying components, please ensure that:

1. You make the changes for every style.
2. You update the documentation.
3. You run `npm run build:registry -w @swiftwc/ui` to update the registry.

## Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: all changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

  e.g. `feat(components): add new prop to the avatar component`

If you are interested in the detailed specification you can visit
https://www.conventionalcommits.org/.

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We’ll be happy to help you out.

## Testing

Tests are written using [Vitest](https://vitest.dev). You can run all the tests from the root of the repository.

```bash
npm run test -w @swiftwc/ui
```

Please ensure that the tests are passing when submitting a pull request. If you’re adding new features, please include tests.
