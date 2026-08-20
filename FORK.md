# Why this fork exists

Upstream is [`Piktos-Media/react-formgen`](https://github.com/Piktos-Media/react-formgen). This fork
carries one change: dependency build scripts are allowed so that installing the repo as a git
dependency can finish.

The repo is consumed by subdirectory (`packages/zod`), and installing a git dependency runs its
`prepare` script, which runs a nested workspace install here. pnpm >= 10 blocks dependency build
scripts by default and a nested install cannot be approved interactively, so it fails with
`ERR_PNPM_IGNORED_BUILDS`. That only shows up on a cold pnpm store — an existing store already has
the package prepared, which is why it looked fine for a long time.

## Consumers

`horang-corp/service-frontend` pins this fork through `pnpm-workspace.yaml`:

```yaml
overrides:
  '@react-formgen/zod': github:rycont/react-formgen#<sha>&path:packages/zod
```

Two notes for whoever touches that pin.

Use the `github:` form with `&path:`, not a `codeload` tarball URL with `#path:`. pnpm does not read
`#path:` on a plain tarball URL — it installs the repository root (`@react-formgen/monorepo`)
instead, with an empty dependency set.

Bump to a new commit rather than reusing one that a store has already seen as the repository root.
pnpm keys its store by tarball integrity and ignores the subdirectory, so the same commit cannot be
stored both ways; the second one fails with `ERR_PNPM_UNEXPECTED_PKG_CONTENT_IN_STORE`.
