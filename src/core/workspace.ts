import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';
import yaml from 'yaml';
import { Workspace, WorkspaceType } from '../types';

export async function getWorkspaces(): Promise<Workspace[]> {
  const cwd = process.cwd();
  const pkgJsonPath = path.join(cwd, 'package.json');
  
  if (!fs.existsSync(pkgJsonPath)) {
    return [];
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  let workspaceGlobs: string[] = [];

  // 1. Check npm/yarn workspaces
  if (pkgJson.workspaces) {
    workspaceGlobs = Array.isArray(pkgJson.workspaces) 
      ? pkgJson.workspaces 
      : pkgJson.workspaces.packages || [];
  }

  // 2. Check pnpm-workspace.yaml
  const pnpmWorkspacePath = path.join(cwd, 'pnpm-workspace.yaml');
  if (workspaceGlobs.length === 0 && fs.existsSync(pnpmWorkspacePath)) {
    const pnpmWorkspace = yaml.parse(fs.readFileSync(pnpmWorkspacePath, 'utf-8'));
    workspaceGlobs = pnpmWorkspace.packages || [];
  }

  if (workspaceGlobs.length === 0) {
    // Fallback to current directory if no workspaces found (not a monorepo?)
    // But usually turbo is used in monorepos. Let's return the root if it has a dev script.
    if (pkgJson.scripts && pkgJson.scripts.dev) {
      return [{ name: pkgJson.name || 'root', dir: '.', type: 'app' }];
    }
    return [];
  }

  // 3. Resolve globs
  const workspaceDirs = await glob(workspaceGlobs, {
    cwd,
    onlyDirectories: true,
    absolute: false,
  });

  const workspaces: Workspace[] = [];

  for (const dir of workspaceDirs) {
    const workspacePkgJsonPath = path.join(cwd, dir, 'package.json');
    if (fs.existsSync(workspacePkgJsonPath)) {
      try {
        const workspacePkgJson = JSON.parse(fs.readFileSync(workspacePkgJsonPath, 'utf-8'));
        if (workspacePkgJson.scripts && workspacePkgJson.scripts.dev) {
          const type: WorkspaceType = dir.startsWith('apps/') ? 'app' : 'package';
          workspaces.push({
            name: workspacePkgJson.name,
            dir,
            type,
          });
        }
      } catch {
        // Skip invalid package.json
      }
    }
  }

  // 4. Sort: Apps first, then Packages, alphabetical within each group
  return workspaces.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'app' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}
