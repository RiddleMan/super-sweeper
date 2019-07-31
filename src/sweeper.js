const fs = require('fs').promises;
const rimraf = require('rimraf');
const util = require('util');
const path = require('path');
const debug = require('debug');

const DOWNLOADS_PATH = path.resolve(process.env.HOME, 'Downloads');
const SCREENSHOTS_PATH = '~/Desktop';

const rimrafP = util.promisify(rimraf);

const getStatsForPaths = async (paths) => {
    const statsPromises = paths.map(async (file) => {
        const fStats = await fs.stat(file);

        return {
            path: file,
            stats: fStats
        };
    });

    return Promise.all(statsPromises);
};

const getStatsOlderThan = async (dir, beforeTime) => {
    const files = await fs.readdir(dir);

    const filePaths = files
        .map((file) => path.join(dir, file));

    const stats = await getStatsForPaths(filePaths);



    return stats
        .filter(({ stats: { mtimeMs } }) => mtimeMs <= beforeTime)
        .filter(({ stats }) => stats.isFile() || stats.isDirectory());
};

const removeFile = ({ path, stats }) =>
    stats.isDirectory()
        ? rimrafP(path)
        : fs.unlink(path);

const removeFiles = (paths) =>
    Promise.all(paths.map(removeFile));

module.exports = {
    clean: async () => {
        const monthEarlierDate = new Date().getTime() - 30*24*60*60*1000;

        const files = (await getStatsOlderThan(DOWNLOADS_PATH, monthEarlierDate));
        await removeFiles(files);
    }
};
