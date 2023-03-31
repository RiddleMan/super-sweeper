const { unlink } = require('fs/promises');
const rimraf = require('rimraf');
const debug = require('debug')('super-sweeper');

const removeFile = ({ path, stats }) =>
    stats.isDirectory()
        ? rimraf(path)
        : unlink(path);

const removeFiles = (paths) => {
    const filePaths = paths.map(({ path }) => path);

    debug('Removing %O', filePaths);

    return Promise.all(paths.map(removeFile));
};

module.exports = removeFiles;
