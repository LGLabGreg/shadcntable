# Contributing

Thanks for your interest in contributing to shadcntable. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

## About this repository

- We use [pnpm](https://pnpm.io) for development.
- We use [Turborepo](https://turbo.build/repo) as our build system.
- We use [changesets](https://github.com/changesets/changesets) for managing releases.

## Structure

This repository is structured as follows:

```
app
components
content
registry
  └── shadcntable
      ├── config
      ├── contexts
      ├── filters
      ├── hooks
      ├── types
      └── utils
```

| Path         | Description                              |
| ------------ | ---------------------------------------- |
| `app`        | The Next.js application for the website. |
| `components` | The React components for the website.    |
| `content`    | The content for the website.             |
| `registry`   | The registry for the components.         |

## Development

### Fork this repo

You can fork this repo by clicking the fork button in the top right corner of this page.

### Clone on your local machine

```bash
git clone https://github.com/your-username/shadcntable.git
```

### Navigate to project directory

```bash
cd shadcntable
```

### Create a new Branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Run

You can use the `pnpm dev` command to start the development process.

## Documentation

Documentation is written using [MDX](https://mdxjs.com). You can find the documentation files in the `content/docs` directory.

## Components

We use a registry system for developing components. You can find the source code for the components under `registry`. The components are organized by styles.

When adding or modifying components, please ensure that:

2. You update the documentation.
3. You run `pnpm registry:build` to update the registry.

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
- `docs`: changing existing or creating new documentation (i.e. README, docs)
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
https://www.conventionalcommits.org/ or check out the
[Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

## Testing

Tests are written using [Vitest](https://vitest.dev). You can run all the tests from the root of the repository.

```bash
pnpm test
```

Please ensure that the tests are passing when submitting a pull request. If you're adding new features, please include tests.
