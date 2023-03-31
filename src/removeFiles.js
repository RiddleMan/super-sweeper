import { unlink } from "node:fs/promises";
import rimraf from "rimraf";
import debugFactory from "debug";

const debug = debugFactory("super-sweeper");

const removeFile = ({ path, stats }) =>
    stats.isDirectory() ? rimraf(path) : unlink(path);

export const removeFiles = (paths) => {
    const filePaths = paths.map(({ path }) => path);

    debug("Removing %O", filePaths);

    return Promise.all(paths.map(removeFile));
};
