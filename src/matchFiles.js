const fs = require('fs');
const util = require('util');
const debug = require('debug')('super-sweeper');
const path = require('path');
const parseRetention = require('./parseRetention');
const logger = require("./logger");

const BEFORE_DATE = '30d';

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

const getStatsForPaths = async (paths) => {
    const statsPromises = paths.map(async (file) => {
        const fStats = await stat(file);

        return {
            path: file,
            stats: fStats
        };
    });

    return Promise.all(statsPromises);
};

const getStatsOlderThan = async (dir, beforeTime) => {
    debug('Removing files in directory %s', dir);

    const files = await readdir(dir);

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
        .filter(({ path: cleanPath }) =>
            match.test(path.basename(cleanPath))
        );

const matchFiles = async ({
    path: cleanPath,
    match = /./,
    retention = BEFORE_DATE,
    _referenceDate = new Date()
}) => {
    const beforeDate = parseRetention(_referenceDate)(retention);

    logger.log(`Removing all files before: ${beforeDate}`);

    const filesOlderThan = await getStatsOlderThan(cleanPath, beforeDate);
    return filterByRegex(filesOlderThan, match);
};

module.exports = matchFiles;
