# 🚀 turbo-dev

Interactive TurboRepo workspace selector. Run `dev` (or any command) for specific packages without typing long filters.

## ✨ Features

- 📂 **Auto Workspace Detection**: Automatically finds your apps and packages (pnpm, npm, yarn).
- ⚡ **Presets**: Save common service combinations in a config file.
- ↺ **Smart Caching**: Remembers your last selection for even faster startups.
- 🏗️ **Ordered UI**: Clean, grouped interface (Presets → Apps → Packages).
- 🛠️ **Configurable**: Fully customizable via `turbo-dev.config.js`.

---

## 🚀 Usage

### Option 1: Direct Run (No Install)

Run it directly in your Turborepo root using `npx`:

```bash
npx turbo-dev
```

### Option 2: Global Installation

Install globally to use the `turbo-dev` command anywhere:

```bash
npm install -g turbo-dev
# Then just run:
turbo-dev
```

### Option 3: Local Script (Recommended for Teams)

Install as a dev dependency:

```bash
npm install -D turbo-dev
```

Then add it to your `package.json` scripts:

```json
{
  "scripts": {
    "dev:select": "turbo-dev"
  }
}
```

---

## ⚙️ Configuration

Create a `turbo-dev.config.js` in your root directory to define presets:

```javascript
module.exports = {
  // Define common groups of services
  presets: {
    web_db: {
      name: "Web + Database",
      packages: ["web", "@repo/db"],
    },
    api_only: {
      name: "API & Config",
      packages: ["api", "@repo/config"],
    },
  },

  // Override the default turbo command (default is "dev")
  command: "dev",

  // Enable/disable the "Run all" option
  runAll: true,
};
```

---

## 🚩 CLI Flags

| Flag              | Description                                               |
| :---------------- | :-------------------------------------------------------- |
| `--all`           | Skip prompt and run all discovered packages               |
| `--preset <name>` | Skip prompt and run a specific preset                     |
| `--command <cmd>` | Override the turbo command to run (e.g., `build`, `lint`) |
| `--no-cache`      | Disable using/saving the last selection                   |
| `--version`       | Show version                                              |
| `--help`          | Show help                                                 |

---

## 📦 How to Publish to NPM

1. **Update Version**: Bump the version in `package.json`.
2. **Build**: Run `npm run build` to generate the `dist` folder.
3. **Login**: `npm login` (if not logged in).
4. **Publish**: `npm publish --access public`.

---

## 📄 License

MIT
