import fs from "fs";
import path from "path";
import glob from "fast-glob";
import yaml from "yaml";
import { Workspace, WorkspaceType } from "../types";

async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

export async function getWorkspaces(): Promise<Workspace[]> {
    const cwd = process.cwd();
    const pkgJsonPath = path.join(cwd, "package.json");

    if (!(await fileExists(pkgJsonPath))) {
        return [];
    }

    let pkgJson: any = {};
    try {
        const pkgContent = await fs.promises.readFile(pkgJsonPath, "utf-8");
        pkgJson = JSON.parse(pkgContent);
    } catch {
        return [];
    }

    let workspaceGlobs: string[] = [];

    // 1. Check npm/yarn workspaces
    if (pkgJson.workspaces) {
        workspaceGlobs = Array.isArray(pkgJson.workspaces)
            ? pkgJson.workspaces
            : pkgJson.workspaces.packages || [];
    }

    // 2. Check pnpm-workspace.yaml
    const pnpmWorkspacePath = path.join(cwd, "pnpm-workspace.yaml");
    if (workspaceGlobs.length === 0 && (await fileExists(pnpmWorkspacePath))) {
        try {
            const pnpmContent = await fs.promises.readFile(pnpmWorkspacePath, "utf-8");
            const pnpmWorkspace = yaml.parse(pnpmContent);
            workspaceGlobs = pnpmWorkspace?.packages || [];
        } catch {
            // Ignore invalid pnpm-workspace.yaml
        }
    }

    if (workspaceGlobs.length === 0) {
        // Fallback to current directory if no workspaces found (not a monorepo?)
        if (pkgJson.scripts) {
            return [{ name: pkgJson.name || "root", dir: ".", type: "app" }];
        }
        return [];
    }

    // 3. Resolve globs with ignore patterns for fast traversal
    const workspaceDirs = await glob(workspaceGlobs, {
        cwd,
        onlyDirectories: true,
        absolute: false,
        ignore: [
            "**/node_modules/**",
            "**/.git/**",
            "**/dist/**",
            "**/.next/**",
            "**/.turbo/**",
            "**/build/**",
        ],
    });

    // 4. Parallel read package.json files
    const workspacePromises = workspaceDirs.map(async (dir) => {
        const workspacePkgJsonPath = path.join(cwd, dir, "package.json");
        try {
            const content = await fs.promises.readFile(workspacePkgJsonPath, "utf-8");
            const workspacePkgJson = JSON.parse(content);
            if (workspacePkgJson.name) {
                const type: WorkspaceType = dir.startsWith("apps/") ? "app" : "package";
                return {
                    name: workspacePkgJson.name as string,
                    dir,
                    type,
                };
            }
        } catch {
            // Skip missing or invalid package.json
        }
        return null;
    });

    const results = await Promise.all(workspacePromises);
    const workspaces = results.filter((w): w is Workspace => w !== null);

    // 5. Sort: Apps first, then Packages, alphabetical within each group
    return workspaces.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === "app" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
}
