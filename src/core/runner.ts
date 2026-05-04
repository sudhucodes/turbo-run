import { execSync } from 'child_process';
import { PackageManager } from './package-manager';
import { logger } from '../utils/logger';

export function runTurbo(selected: string[], pm: PackageManager, command: string = 'dev') {
  if (!selected.length) {
    process.exit(0);
  }

  const filters = selected.map(p => `--filter=${p}`).join(' ');
  const cmd = `${pm === 'npx' ? 'npx' : pm} turbo run ${command} ${filters}`;

  logger.info('\nExecuting:');
  logger.bold(cmd + '\n');

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    // Turbo command failure is handled by turbo itself (stdio inherit)
    process.exit(1);
  }
}
