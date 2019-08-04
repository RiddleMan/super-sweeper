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

module.exports = {
    clean: async ({
        paths
    }) => {
        const removalPromises = Object.entries(paths)
            .map(cleanPath);

        return Promise.all(removalPromises);
    }
};
