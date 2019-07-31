const fs = require('fs').promises;
const rimraf = require('rimraf');
const util = require('util');
const path = require('path');
const debug = require('debug')('super-sweeper');

const DOWNLOADS_PATH = path.resolve(process.env.HOME, 'Downloads');
const SCREENSHOTS_PATH = path.resolve(process.env.HOME, 'Desktop');

const BEFORE_DATE = new Date().getTime() - 30*24*60*60*1000;

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
    debug('Removing files in directory %s', dir);

    const files = await fs.readdir(dir);

    debug('Reading stats for %O', files);

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

const removeFiles = (paths) => {
    const filePaths = paths.map(({ path }) => path);

    debug('Removing %O', filePaths);

    return Promise.all(paths.map(removeFile));
};

const getDownloads = () => {
    return getStatsOlderThan(DOWNLOADS_PATH, BEFORE_DATE);
};

const getScreenshots = async () => {
    const files = await getStatsOlderThan(SCREENSHOTS_PATH, BEFORE_DATE);

    return files.filter(({ path: filePath }) => {
        const name = path.basename(filePath);

        return name.startsWith('Screenshot ')
            || name.startsWith('Screen Recording');
    })
};

module.exports = {
    clean: async () => {
        console.log(`Removing all files before: ${new Date(BEFORE_DATE).toGMTString()}`);

        const downloadFiles = await getDownloads();
        const screenshotsFiles = await getScreenshots();

        const files = [...downloadFiles, ...screenshotsFiles];

        console.log(`Found ${files.length} files.`);
        console.log('Removing...');

        await removeFiles(files);

        console.log(`Successfully removed ${files.length} files.`);
    }
};
