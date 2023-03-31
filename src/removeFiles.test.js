import { vi, test, beforeEach, expect } from "vitest";
import { removeFiles } from "./removeFiles.js";
import * as fs from "node:fs/promises";
import rimraf from "rimraf";

vi.mock("node:fs/promises");
vi.mock("rimraf");

beforeEach(() => {
    vi.clearAllMocks();
});

test("should remove file using unlink", async () => {
    const expectedPath = "blahblah";

    await removeFiles([
        {
            path: expectedPath,
            stats: {
                isDirectory: () => false,
            },
        },
    ]);

    const actualPath = fs.unlink.mock.calls[0][0];

    expect(actualPath).toBe(expectedPath);
});

test("should remove directory using rimraf", async () => {
    const expectedPath = "blahblah";

    await removeFiles([
        {
            path: expectedPath,
            stats: {
                isDirectory: () => true,
            },
        },
    ]);

    const actualPath = rimraf.mock.calls[0][0];

    expect(actualPath).toBe(expectedPath);
});

test("should work for multiple files/dirs too", async () => {
    const expectedPath1 = "blahblah";
    const expectedPath2 = "asdf";
    const expectedPath3 = "1337";

    await removeFiles([
        {
            path: expectedPath1,
            stats: {
                isDirectory: () => true,
            },
        },
        {
            path: expectedPath2,
            stats: {
                isDirectory: () => false,
            },
        },
        {
            path: expectedPath3,
            stats: {
                isDirectory: () => true,
            },
        },
    ]);

    const actualPath1 = rimraf.mock.calls[0][0];
    const actualPath2 = fs.unlink.mock.calls[0][0];
    const actualPath3 = rimraf.mock.calls[1][0];

    expect(actualPath1).toBe(expectedPath1);
    expect(actualPath2).toBe(expectedPath2);
    expect(actualPath3).toBe(expectedPath3);
});
