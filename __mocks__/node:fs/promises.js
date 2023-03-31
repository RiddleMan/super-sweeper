import * as path from 'node:path';
import { vi } from 'vitest';

let mockFiles = {};

export const __setMockFiles = (files) => {
    mockFiles = files;
};

export const stat = vi.fn(async (cleanPath) => {
    const name = path.basename(cleanPath);

    return mockFiles[name];
});

export const readdir = vi.fn(async () => 
  Object.keys(mockFiles) ?? []);

export const unlink = vi.fn();
