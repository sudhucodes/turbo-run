export interface Preset {
  name: string;
  packages: string[];
}

export interface TurboDevConfig {
  presets?: Record<string, Preset>;
  command?: string;
  runAll?: boolean;
}

export type WorkspaceType = 'app' | 'package';

export interface Workspace {
  name: string;
  dir: string;
  type: WorkspaceType;
}

export interface CacheData {
  lastSelected: string[];
  timestamp: number;
}
