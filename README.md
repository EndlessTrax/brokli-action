# Brokli Link Checker Action

![Linter](https://github.com/EndlessTrax/brokli-action/actions/workflows/linter.yml/badge.svg)
![CI](https://github.com/EndlessTrax/brokli-action/actions/workflows/ci.yml/badge.svg)
![Check dist/](https://github.com/EndlessTrax/brokli-action/actions/workflows/check-dist.yml/badge.svg)
![CodeQL](https://github.com/EndlessTrax/brokli-action/actions/workflows/codeql-analysis.yml/badge.svg)
![Coverage](./badges/coverage.svg)

This GitHub Action makes it easy to add
[@EndlessTrax/brokli](https://github.com/EndlessTrax/brokli) CLI to CI/CD
pipelines. It checks for broken links before the deployment of a static site
using a static site generator.

## Features

- Check for broken links in static sites before deployment
- Support for Hugo static site generator (more to come in future releases)
- Optional support for including draft posts
- Configurable port override for the static site server

## Usage

To use this action in your workflow, add the following step:

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Check for broken links
    id: brokli
    uses: EndlessTrax/brokli-action@v1
    with:
      generator: 'hugo'

  - name: Print result
    id: output
    run: echo "${{ steps.brokli.outputs.result }}"
```

### Inputs

#### `generator` (required)

The static site generator to use. Currently supported:

- `hugo` - Hugo static site generator

**Example:**

```yaml
with:
  generator: 'hugo'
```

#### `drafts` (optional)

Include draft posts when checking links. Default: `false`

**Example:**

```yaml
with:
  generator: 'hugo'
  drafts: 'true'
```

#### `port` (optional)

Override default port for the static site server.

**Example:**

```yaml
with:
  generator: 'hugo'
  port: '8080'
```

### Outputs

#### `result`

Result of the broken link check. Possible values:

- `success` - No broken links found
- `failure` - Broken links detected
- `error` - An error occurred during the check

### Complete Example

```yaml
name: Check Broken Links

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check-links:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check for broken links
        uses: EndlessTrax/brokli-action@v1
        with:
          generator: 'hugo'
          drafts: 'true'
          port: '1313'
```

## Development

### Initial Setup

1. Install dependencies

   ```bash
   npm install
   ```

2. Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

3. Run the tests

   ```bash
   npm test
   ```

### Making Changes

1. Create a new branch

   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes to the source code in `src/`
3. Add tests in `__tests__/` for your changes
4. Format, test, and build the action

   ```bash
   npm run all
   ```

5. Commit and push your changes

### Testing Locally

You can test the action locally using
[`@github/local-action`](https://github.com/github/local-action):

```bash
npx @github/local-action . src/main.ts .env
```

Create a `.env` file based on `.env.example` to set the required inputs:

```env
INPUT_GENERATOR=hugo
INPUT_DRAFTS=false
INPUT_PORT=
```

## License

MIT
