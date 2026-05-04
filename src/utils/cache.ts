import fs from 'fs';
import path from 'path';
import { CacheData } from '../types';

const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.cache', 'turbo-dev');
const CACHE_FILE = path.join(CACHE_DIR, 'last.json');

export const cache = {
  get: (): CacheData | null => {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      }
    } catch {
      // Ignore cache errors
    }
    return null;
  },
  set: (selected: string[]) => {
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      const data: CacheData = {
        lastSelected: selected,
        timestamp: Date.now(),
      };
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch {
      // Ignore cache errors
    }
  },
};
