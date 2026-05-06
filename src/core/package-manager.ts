import fs from 'fs';
import path from 'path';

export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'npx';

export function detectPackageManager(): PackageManager {
    const cwd = process.cwd();

    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
        return 'pnpm';
    }

    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
        return 'yarn';
    }

    if (fs.existsSync(path.join(cwd, 'package-lock.json'))) {
        return 'npm';
    }

    return 'npx';
}
