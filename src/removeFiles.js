const fs = require('fs');
const util = require('util');
const rimrafP = util.promisify(require('rimraf'));
const debug = require('debug')('super-sweeper');

const unlink = util.promisify(fs.unlink);

const removeFile = ({ path, stats }) =>
    stats.isDirectory()
        ? rimrafP(path)
        : unlink(path);

const removeFiles = (paths) => {
    const filePaths = paths.map(({ path }) => path);

    debug('Removing %O', filePaths);

    return Promise.all(paths.map(removeFile));
};

module.exports = removeFiles;
