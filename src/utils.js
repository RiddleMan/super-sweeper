import * as os from 'node:os';

export const expandHome = (dir) =>
    dir.replace(/^~/, os.homedir());

export const runSeries = (promiseGenerators) =>
    promiseGenerators.reduce(
        (res, curr) =>
            res.then(() => curr()),
        Promise.resolve()
    );
