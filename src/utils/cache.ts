import fs from "fs";
import path from "path";
import { CacheData } from "../types";

const CACHE_DIR = path.join(process.cwd(), "node_modules", ".cache", "turbo-run");
const CACHE_FILE = path.join(CACHE_DIR, "last.json");

export const cache = {
    get: async (): Promise<CacheData | null> => {
        try {
            const content = await fs.promises.readFile(CACHE_FILE, "utf-8");
            return JSON.parse(content);
        } catch {
            // Ignore cache errors (file missing or corrupt)
            return null;
        }
    },
    set: async (selected: string[]): Promise<void> => {
        try {
            await fs.promises.mkdir(CACHE_DIR, { recursive: true });
            const data: CacheData = {
                lastSelected: selected,
                timestamp: Date.now(),
            };
            await fs.promises.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
        } catch {
            // Ignore cache errors
        }
    },
};
