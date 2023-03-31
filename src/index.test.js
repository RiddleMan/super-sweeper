import { describe, test, beforeEach, vi, expect } from 'vitest';
import { matchFiles } from './matchFiles';
import { removeFiles } from './removeFiles';
import * as os from 'node:os';
import { clean } from './index';

vi.mock('./matchFiles.js');
vi.mock('./removeFiles.js');
vi.mock('node:os');


beforeEach(() => {
    vi.clearAllMocks();
});

describe('clean()', () => {
    test('should call removeFiles with those provided by matchFiles', async () => {
        const expectedFiles = [
            { path: '/var/log/tmp' },
            { path: '/var/log/sth' }
        ];
        matchFiles.mockResolvedValue(expectedFiles);

        await clean({
            options: {},
            paths: [{ path: '/var/log' }]
        });

        expect(removeFiles)
            .toBeCalledWith(expectedFiles);
    });

    test('should not call removeFiles when dry mode is enabled', async () => {
        const expectedFiles = [
            { path: '/var/log/tmp' },
            { path: '/var/log/sth' }
        ];
        matchFiles.mockResolvedValue(expectedFiles);

        await clean({
            options: {
                dry: true
            },
            paths: [{ path: '/var/log' }]
        });

        expect(removeFiles)
            .not.toBeCalled();
    });

    test('should call matchFiles with path, match, and retention', async () => {
        matchFiles.mockResolvedValue([]);

        const expectedPathDef = {
            path: '/var/log',
            match: /^asdf/,
            retention: '30d'
        };
        await clean({
            options: {},
            paths: [expectedPathDef]
        });

        expect(matchFiles)
            .toBeCalledWith(expectedPathDef);
    });

    test('should expand user home directory', async () => {
        os.__setHomeDir('/home/h4x0r');
        matchFiles.mockResolvedValue([]);
        const expectedPathDef = {
            path: '~/Downloads'
        };

        await clean({
            options: {},
            paths: [expectedPathDef]
        });

        expect(matchFiles)
            .toBeCalledWith({
                path: '/home/h4x0r/Downloads'
            });
    });

    test('should call matchFiles 3 times', async () => {
        matchFiles.mockResolvedValue([]);
        const expectedPathDef1 = {
            path: 'Downloads'
        };
        const expectedPathDef2 = {
            path: './sth'
        };
        const expectedPathDef3 = {
            path: '/var/log'
        };

        await clean({
            options: {},
            paths: [expectedPathDef1, expectedPathDef2, expectedPathDef3]
        });

        expect(matchFiles)
            .toBeCalledWith(expectedPathDef1);
        expect(matchFiles)
            .toBeCalledWith(expectedPathDef2);
        expect(matchFiles)
            .toBeCalledWith(expectedPathDef3);
    });

    test('should call removeFiles 3 times', async () => {
        const expectedFiles = [{ path: 'expected' }];
        matchFiles.mockResolvedValue(expectedFiles);

        await clean({
            options: {},
            paths: [{
                path: 'Downloads'
            }, {
                path: './sth'
            }, {
                path: '/var/log'
            }]
        });

        expect(removeFiles)
            .toBeCalledWith(expectedFiles);
        expect(removeFiles)
            .toBeCalledWith(expectedFiles);
        expect(removeFiles)
            .toBeCalledWith(expectedFiles);
    });
});
