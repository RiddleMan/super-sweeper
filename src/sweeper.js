const matchFiles = require('./matchFiles');
const removeFiles = require('./removeFiles');

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

const runSeries = (promiseGenerators) =>
    promiseGenerators.reduce(
        (res, curr) =>
            res.then(() => curr()),
        Promise.resolve()
    );

module.exports = {
    clean: async ({
        paths
    }) => {
        const removalPromises = Object.entries(paths)
            .map((path) => () => cleanPath(path));

        return runSeries(removalPromises);
    }
};
