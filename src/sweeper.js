const path = require('path');
const matchFiles = require('./matchFiles');
const removeFiles = require('./removeFiles');
const logger = require("./logger");
const { expandHome, runSeries } = require("./utils");

const removeFilesWithOptions = ({ dry }) => async (files) => {
    if(dry) {
        logger.log('Dry mode enabled. Showing files to remove.');
        logger.log(
            files.map(({ path }) => path)
                .map((path) => `Skipping ${path}`)
                .join('\n')
        );
        return;
    }

    logger.log('Removing...');
    await removeFiles(files);
};

const cleanPath = (options) => async ([
    cleanPath,
    predicate
]) => {
    logger.log(`Sweeping ${cleanPath}`);
    const cleanPathResolved = expandHome(cleanPath);

    const files = await matchFiles(cleanPathResolved, predicate);

    logger.log(`Found ${files.length} files.`);

    await removeFilesWithOptions(options)(files);

    logger.log(`Successfully removed ${files.length} files.`);
};

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
