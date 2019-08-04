const matchFiles = require('./matchFiles');
const removeFiles = require('./removeFiles');

const removeFilesWithOptions = ({ dry }) => async (files) => {
    if(dry) {
        console.log('Dry mode enabled. Showing files to remove.');
        console.log(
            files.map(({ path }) => path)
                .map((path) => `Skipping ${path}`)
                .join('\n')
        );
        return;
    }

    console.log('Removing...');
    await removeFiles(files);
};

const cleanPath = (options) => async ([
    cleanPath,
    predicate
]) => {
    console.log(`Sweeping ${cleanPath}`);

    const files = await matchFiles(cleanPath, predicate);

    console.log(`Found ${files.length} files.`);

    await removeFilesWithOptions(options)(files);

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
        options,
        paths
    }) => {
        const cleanPathSingle = cleanPath(options);

        const removalPromises = Object.entries(paths)
            .map((path) => () => cleanPathSingle(path));

        return runSeries(removalPromises);
    }
};
