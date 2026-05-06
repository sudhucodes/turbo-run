import fs from 'fs';
import path from 'path';
import { TurboDevConfig } from '../types';
import { defaultConfig } from './defaults';

export async function loadConfig(): Promise<TurboDevConfig> {
    const configFiles = [
        'turbo-run.config.js',
        'turbo-run.config.mjs',
        'turbo-run.config.cjs',
    ];

    for (const file of configFiles) {
        const configPath = path.join(process.cwd(), file);
        if (fs.existsSync(configPath)) {
            try {
                // Use dynamic import for config files
                const userConfig = await import(configPath);
                return {
                    ...defaultConfig,
                    ...(userConfig.default || userConfig),
                };
            } catch (err) {
                console.error(`Error loading config from ${file}:`, err);
            }
        }
    }

    return defaultConfig;
}
