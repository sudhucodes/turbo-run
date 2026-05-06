# turbo-run

Interactive TurboRepo workspace selector. Run `dev` by default, or pass another Turbo task for specific packages without typing long filters.

## Features

- Auto workspace detection for `pnpm`, `npm`, and `yarn`
- Presets for common app/package groups
- Caching for the last selection
- Interactive app/package picker
- Configurable with `turbo-run.config.js`

## Usage

### Option 1: Direct Run (No Install)

Run it directly in your Turborepo root using `npx`:

```bash
npx turbo-run
npx turbo-run build
```

### Option 2: Global Installation

Install globally to use the `turbo-run` command anywhere:

```bash
npm install -g turbo-run

turbo-run
turbo-run lint
```

### Option 3: Local Script (Recommended for Teams)

Install as a dev dependency:

```bash
npm install -D turbo-run
```

Then add it to your `package.json` scripts:

```json
{
    "scripts": {
        "dev:select": "turbo-run",
        "build:select": "turbo-run build"
    }
}
```

## Configuration

Create a `turbo-run.config.js` in your root directory to define presets:

```javascript
module.exports = {
    presets: {
        web_db: {
            name: 'Web + Database',
            packages: ['web', '@repo/db'],
        },
        api_only: {
            name: 'API & Config',
            packages: ['api', '@repo/config'],
        },
    },

    runAll: true,
};
```

## CLI Flags

| Flag              | Description                                               |
| :---------------- | :-------------------------------------------------------- |
| `--all`           | Skip prompt and run all discovered packages               |
| `--preset <name>` | Skip prompt and run a specific preset                     |
| `--command <cmd>` | Override the turbo command to run (e.g., `build`, `lint`) |
| `--no-cache`      | Disable using/saving the last selection                   |
| `--version`       | Show version                                              |
| `--help`          | Show help                                                 |

Positional command:

```bash
npx turbo-run        # defaults to "dev"
npx turbo-run dev
npx turbo-run build
```

## Publish to npm

1. **Update Version**: Bump the version in `package.json`.
2. **Create a Changeset**: Run `pnpm run changeset` and describe the release.
3. **Version Packages**: Run `pnpm run version-packages` to apply the version bump.
4. **Format and Verify**: Run `pnpm run format`, `pnpm run format:check`, and `pnpm run build`.
5. **Verify Package Contents**: Run `pnpm pack --dry-run` and confirm only the expected files are included.
6. **Login**: `pnpm login` (if not logged in).
7. **Publish**: Run `pnpm run release` or `pnpm publish --access public`.

## Development

```bash
npm run format
npm run format:check
npm run changeset
```

## License

MIT
