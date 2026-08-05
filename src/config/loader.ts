import fs from "fs";
import path from "path";
import { TurboDevConfig } from "../types";
import { defaultConfig } from "./defaults";

export async function loadConfig(): Promise<TurboDevConfig> {
    const configFiles = ["turbo-run.config.js", "turbo-run.config.mjs", "turbo-run.config.cjs"];

    for (const file of configFiles) {
        const configPath = path.join(process.cwd(), file);
        try {
            await fs.promises.access(configPath);
            // Use dynamic import for config files
            const userConfig = await import(configPath);
            return {
                ...defaultConfig,
                ...(userConfig.default || userConfig),
            };
        } catch {
            // File does not exist or import failed, try next
        }
    }

    return defaultConfig;
}
