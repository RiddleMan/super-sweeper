const os = require('os');

const expandHome = (dir) =>
    dir.replace(/^~/, os.homedir());

const runSeries = (promiseGenerators) =>
    promiseGenerators.reduce(
        (res, curr) =>
            res.then(() => curr()),
        Promise.resolve()
    );

module.exports = {
    expandHome,
    runSeries
};
