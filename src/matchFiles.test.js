import { test, expect, vi } from "vitest";
import * as fs from "node:fs/promises";
import { matchFiles } from "./matchFiles.js";

vi.mock("node:fs/promises");

const REFERENCE_DATE = new Date(2019, 8, 1, 12, 30, 20);

test("should return 0 files when they are not meeting any predicate", async () => {
    fs.__setMockFiles({
        a: {
            mtimeMs: REFERENCE_DATE.getTime(),
            isFile: () => true,
        },
        b: {
            mtimeMs: REFERENCE_DATE.getTime(),
            isFile: () => true,
        },
        c: {
            mtimeMs: REFERENCE_DATE.getTime(),
            isFile: () => true,
        },
    });

    const actual = await matchFiles({
        path: "asdf",
        _referenceDate: REFERENCE_DATE,
    });

    expect(actual).toStrictEqual([]);
});

test("should return a file when is older than retention setting", async () => {
    const expectedStat = {
        mtimeMs: new Date(2019, 7, 1).getTime(),
        isFile: () => true,
    };
    fs.__setMockFiles({
        a: expectedStat,
    });

    const actual = await matchFiles({
        path: "asdf",
        retention: "1d",
        _referenceDate: REFERENCE_DATE,
    });

    expect(actual).toStrictEqual([{ path: "asdf/a", stats: expectedStat }]);
});

test("should return a file when is older than retention setting and matches RegExp", async () => {
    const expectedStat = {
        mtimeMs: new Date(2019, 7, 1).getTime(),
        isFile: () => true,
    };
    fs.__setMockFiles({
        a: expectedStat,
    });

    const actual = await matchFiles({
        path: "asdf",
        retention: "1d",
        match: /^a/,
        _referenceDate: REFERENCE_DATE,
    });

    expect(actual).toStrictEqual([{ path: "asdf/a", stats: expectedStat }]);
});

test("should not return a file when does not match RegExp", async () => {
    const expectedStat = {
        mtimeMs: new Date(2019, 7, 1).getTime(),
        isFile: () => true,
    };
    fs.__setMockFiles({
        b: expectedStat,
    });

    const actual = await matchFiles({
        path: "asdf",
        retention: "1d",
        match: /^a/,
        _referenceDate: REFERENCE_DATE,
    });

    expect(actual).toStrictEqual([]);
});

test("should not return when is neither file nor directory", async () => {
    const expectedStat = {
        mtimeMs: new Date(2019, 7, 1).getTime(),
        isFile: () => false,
        isDirectory: () => false,
    };
    fs.__setMockFiles({
        a: expectedStat,
    });

    const actual = await matchFiles({
        path: "asdf",
        retention: "1d",
        match: /^a/,
        _referenceDate: REFERENCE_DATE,
    });

    expect(actual).toStrictEqual([]);
});

test("should work for many files", async () => {
    const expectedStat1 = {
        mtimeMs: new Date(2019, 7, 1).getTime(),
        isFile: () => true,
        isDirectory: () => true,
    };
    const expectedStat2 = {
        mtimeMs: new Date(2019, 8, 1).getTime(),
        isFile: () => true,
        isDirectory: () => false,
    };
    const expectedStat3 = {
        mtimeMs: new Date(2019, 7, 1).getTime(),
        isFile: () => false,
        isDirectory: () => false,
    };
    fs.__setMockFiles({
        a: expectedStat1,
        b: expectedStat2,
        c: expectedStat3,
    });

    const actual = await matchFiles({
        path: "asdf",
        retention: "1d",
        match: /^a/,
        _referenceDate: REFERENCE_DATE,
    });

    expect(actual).toStrictEqual([{ path: "asdf/a", stats: expectedStat1 }]);
});
