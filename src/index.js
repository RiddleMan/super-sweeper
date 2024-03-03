import { matchFiles } from "./matchFiles.js";
import { removeFiles } from "./removeFiles.js";
import * as logger from "./logger.js";
import { expandHome, runSeries } from "./utils.js";

const removeFilesWithOptions =
    ({ dry }) =>
    async (files) => {
        if (dry) {
            logger.log("Dry mode enabled. Showing files to remove.");
            logger.log(
                files
                    .map(({ path }) => path)
                    .map((path) => `Skipping ${path}`)
                    .join("\n"),
            );
            return;
        }

        logger.log("Removing...");
        await removeFiles(files);
    };

const cleanPath =
    (options) =>
    async ({ path: cleanPath, match, retention }) => {
        logger.log(`Sweeping ${cleanPath}`);
        const cleanPathResolved = expandHome(cleanPath);

        const files = await matchFiles({
            path: cleanPathResolved,
            match,
            retention,
        });

        logger.log(`Found ${files.length} files.`);

        await removeFilesWithOptions(options)(files);

        logger.log(`Successfully removed ${files.length} files.`);
    };

export const clean = async ({ options, paths }) => {
    const cleanPathSingle = cleanPath(options);

    const removalPromises = paths.map((path) => () => cleanPathSingle(path));

    return runSeries(removalPromises);
};
