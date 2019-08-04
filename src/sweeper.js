const fs = require('fs').promises;
const util = require('util');
const rimrafP = util.promisify(require('rimraf'));
const path = require('path');
const debug = require('debug')('super-sweeper');
const parseRetention = require('./parseRetention');

const BEFORE_DATE = '30d';

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

const filterByRegex = (paths, match) =>
    paths
        .filter(({ path }) => match.test(path));

const matchFiles = async (
    cleanPath,
    {
        match = /./,
        retention = BEFORE_DATE
    }) => {
    const beforeDate = parseRetention(new Date())(retention);

    console.log(`Removing all files before: ${beforeDate}`);

    const filesOlderThan = await getStatsOlderThan(cleanPath, retention);
    return filterByRegex(filesOlderThan, match);
};

const cleanPath = async ([
    cleanPath,
    predicate
]) => {
    console.log(`Sweeping ${cleanPath}`);

    const files = await matchFiles(cleanPath, predicate);

    console.log(`Found ${files.length} files.`);
    console.log('Removing...');

    await removeFiles(files);

    console.log(`Successfully removed ${files.length} files.`);
};

module.exports = {
    clean: async ({
        paths
    }) => {
        const removalPromises = Object.entries(paths)
            .map(cleanPath);

        return Promise.all(removalPromises);
    }
};
