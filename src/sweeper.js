const fs = require('fs');
const util = require('util');
const path = require('path');
const debug = require('debug');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const DOWNLOADS_PATH = path.resolve(process.env.HOME, 'Downloads');
const SCREENSHOTS_PATH = '~/Desktop';

const getStatsOlderThan = async (dir, beforeTime) => {
    const files = await readdir(dir);

    const statPromises = files
        .map((file) => path.join(dir, file))
        .map(async (file) => {
            const fStats = await stat(file);

            return {
                path: file,
                stats: fStats
            };
        });

    const stats = await Promise.all(statPromises);

    return stats
        .filter(({ stats: { mtimeMs } }) => mtimeMs <= beforeTime)
        .filter(({ stats }) => stats.isFile() || stats.isDirectory())
        .map(({ path }) => path);
};

module.exports = {
    clean: async () => {
        const monthEarlierDate = new Date().getTime() - 30*24*60*60*1000;

        const files = (await getStatsOlderThan(DOWNLOADS_PATH, monthEarlierDate));
        console.log(files);
    }
};
