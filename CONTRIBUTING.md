# Contributing

This document is intended for developers interested in making contributions to prefresh.

## Getting Started

This steps will help you to set up your development environment.

1. Clone the git repository: `git clone git@github.com:jovidecroock/prefresh.git`
2. Go into the cloned folder: `cd prefresh/`
3. Install all dependencies: `yarn`

All linting will be done in pre-commit hooks and we're using eslint + prettier for that.

## How do I document a change for the changelog?

This project uses [changesets](https://github.com/atlassian/changesets). This means that for
every PR there must be documentation for what has been changed and which package is affected.

You can document a change by running `yarn changeset` in the root, which will ask you which packages
have changed and whether the change is major/minor/patch. It will then ask you to write a change entry as markdown. 

[Read more about adding a `changeset` here.](https://github.com/atlassian/changesets/blob/master/docs/adding-a-changeset.md#i-am-in-a-multi-package-repository-a-mono-repo)
