import prompts from 'prompts';
import { Workspace, TurboDevConfig, CacheData } from '../types';
import pc from 'picocolors';

export async function selectPackages(
  workspaces: Workspace[],
  config: TurboDevConfig,
  cache: CacheData | null
): Promise<string[]> {
  const choices: prompts.Choice[] = [];

  // 1. Last Selection (if exists)
  if (cache && cache.lastSelected.length > 0) {
    choices.push({
      title: pc.cyan(`↺ Last selection (${cache.lastSelected.join(', ')})`),
      value: '__cache',
    });
  }

  // 2. Presets
  if (config.presets && Object.keys(config.presets).length > 0) {
    for (const [id, preset] of Object.entries(config.presets)) {
      choices.push({
        title: pc.yellow(`⚡ ${preset.name}`),
        value: `__preset:${id}`,
      });
    }
  }

  // 3. Run All
  if (config.runAll !== false) {
    choices.push({
      title: pc.bold('◉ Run all'),
      value: '__all',
    });
  }

  // 4. Apps
  const apps = workspaces.filter(w => w.type === 'app');
  if (apps.length > 0) {
    choices.push({ title: pc.dim('── Apps ──'), disabled: true });
    apps.forEach(app => {
      choices.push({ title: app.name, value: app.name });
    });
  }

  // 5. Packages
  const packages = workspaces.filter(w => w.type === 'package');
  if (packages.length > 0) {
    choices.push({ title: pc.dim('── Packages ──'), disabled: true });
    packages.forEach(pkg => {
      choices.push({ title: pkg.name, value: pkg.name });
    });
  }

  const response = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: 'Select services to run:',
    choices,
    min: 1,
    hint: '- Space to select, Enter to confirm',
    instructions: false,
  });

  if (!response.selected) {
    process.exit(0);
  }

  return resolveSelection(response.selected, workspaces, config, cache);
}

function resolveSelection(
  selected: string[],
  allWorkspaces: Workspace[],
  config: TurboDevConfig,
  cache: CacheData | null
): string[] {
  if (selected.includes('__all')) {
    return allWorkspaces.map(w => w.name);
  }

  const final = new Set<string>();

  for (const item of selected) {
    if (item === '__cache' && cache) {
      cache.lastSelected.forEach(p => final.add(p));
    } else if (item.startsWith('__preset:')) {
      const presetId = item.replace('__preset:', '');
      const preset = config.presets?.[presetId];
      if (preset) {
        preset.packages.forEach(p => final.add(p));
      }
    } else {
      final.add(item);
    }
  }

  return Array.from(final);
}
