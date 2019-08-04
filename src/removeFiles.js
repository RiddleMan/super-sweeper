const fs = require('fs').promises;
const util = require('util');
const rimrafP = util.promisify(require('rimraf'));
const debug = require('debug')('super-sweeper');

const removeFile = ({ path, stats }) =>
    stats.isDirectory()
        ? rimrafP(path)
        : fs.unlink(path);

const removeFiles = (paths) => {
    const filePaths = paths.map(({ path }) => path);

    debug('Removing %O', filePaths);

    return Promise.all(paths.map(removeFile));
};

module.exports = removeFiles;
