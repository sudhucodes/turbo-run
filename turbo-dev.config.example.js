/**
 * Turbo-dev configuration example
 * Save as turbo-dev.config.js in your repo root
 */

module.exports = {
  /**
   * Define custom presets for common service combinations
   */
  presets: {
    web_db: {
      name: "Web + Database",
      packages: ["web", "@repo/db"]
    },
    full_stack: {
      name: "Full Stack (Web, API, DB)",
      packages: ["web", "api", "@repo/db", "@repo/config"]
    }
  },

  /**
   * The turbo command to run (default: "dev")
   */
  command: "dev",

  /**
   * Whether to show the "Run all" option in the interactive menu
   */
  runAll: true
};
