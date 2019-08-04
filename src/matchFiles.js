const fs = require('fs').promises;
const debug = require('debug')('super-sweeper');
const path = require('path');
const parseRetention = require('./parseRetention');
const logger = require("./logger");

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
        .filter(({ stats: { mtimeMs } }) =>
            mtimeMs <= beforeTime.getTime()
        )
        .filter(({ stats }) =>
            stats.isFile() || stats.isDirectory()
        );
};

const filterByRegex = (paths, match) =>
    paths
        .filter(({ path }) => match.test(path));

const matchFiles = async (
    cleanPath,
    {
        match = /./,
        retention = BEFORE_DATE
    }
) => {
    const beforeDate = parseRetention(new Date())(retention);

    logger.log(`Removing all files before: ${beforeDate}`);

    const filesOlderThan = await getStatsOlderThan(cleanPath, beforeDate);
    return filterByRegex(filesOlderThan, match);
};

module.exports = matchFiles;
