#!/usr/bin/env node
import { Command } from 'commander';
import { loadConfig } from './config/loader';
import { getWorkspaces } from './core/workspace';
import { detectPackageManager } from './core/package-manager';
import { runTurbo } from './core/runner';
import { selectPackages } from './ui/prompt';
import { cache as cacheUtil } from './utils/cache';
import { logger } from './utils/logger';

async function main() {
  const program = new Command();

  program
    .name('turbo-dev')
    .description('Interactive TurboRepo workspace selector')
    .version('0.1.0')
    .option('--all', 'Run all workspaces')
    .option('--preset <name>', 'Run a specific preset')
    .option('--no-cache', 'Disable caching last selection')
    .option('--command <cmd>', 'Override turbo command (default: dev)')
    .parse(process.argv);

  const options = program.opts();

  try {
    // 1. Detect environment
    const [config, workspaces, pm] = await Promise.all([
      loadConfig(),
      getWorkspaces(),
      detectPackageManager(),
    ]);

    if (workspaces.length === 0) {
      logger.error('No workspaces with a "dev" script found.');
      process.exit(1);
    }

    const command = options.command || config.command || 'dev';
    let selected: string[] = [];

    // 2. Resolve selection
    if (options.all) {
      selected = workspaces.map(w => w.name);
    } else if (options.preset) {
      const preset = config.presets?.[options.preset];
      if (!preset) {
        logger.error(`Preset "${options.preset}" not found in config.`);
        process.exit(1);
      }
      selected = preset.packages;
    } else {
      // Interactive mode
      const lastCache = options.cache ? cacheUtil.get() : null;
      selected = await selectPackages(workspaces, config, lastCache);
    }

    // 3. Save cache
    if (options.cache && selected.length > 0) {
      cacheUtil.set(selected);
    }

    // 4. Run turbo
    runTurbo(selected, pm, command);

  } catch (err: any) {
    logger.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
