import { vi, beforeEach, describe, expect, test } from "vitest";
import * as os from "node:os";
import { expandHome, runSeries } from "./utils.js";

vi.mock("node:os");

beforeEach(() => {
    vi.clearAllMocks();
});

describe("expandHome()", () => {
    beforeEach(() => {
        os.__setHomeDir("/home/a");
    });

    test("should expand home directory when ~ occurs", () => {
        const actual = expandHome("~/asdf");

        expect(actual).toBe("/home/a/asdf");
    });

    test("should not expand when ~ is in position other than beginning", () => {
        const expectedPath = "/~/asdf";
        const actual = expandHome(expectedPath);

        expect(actual).toBe(expectedPath);
    });

    test("should do nothing for path without ~", () => {
        const expectedPath = "/etc/conf.d/";
        const actual = expandHome(expectedPath);

        expect(actual).toBe(expectedPath);
    });
});

describe("runSeries()", () => {
    test("should run all promises provided to the function", async () => {
        let res = "";
        const a = vi.fn(() => (res += "a"));
        const b = vi.fn(() => (res += "b"));
        const c = vi.fn(() => (res += "c"));

        await runSeries([a, b, c]);

        expect(res).toBe("abc");
    });

    test("should run in a correct order", async () => {
        let res = "";
        const a = vi.fn(
            () =>
                new Promise((resolve) => {
                    res += "a";
                    setTimeout(resolve, 1000);
                })
        );
        const b = vi.fn(
            () =>
                new Promise((resolve) => {
                    res += "b";
                    setTimeout(resolve, 100);
                })
        );
        const c = vi.fn(
            () =>
                new Promise((resolve) => {
                    res += "c";
                    setTimeout(resolve, 10);
                })
        );

        await runSeries([a, b, c]);

        expect(res).toBe("abc");
    });

    test("should not continue chain on rejection", async () => {
        let res = "";
        const a = vi.fn(
            () =>
                new Promise((resolve) => {
                    res += "a";
                    setTimeout(resolve, 1000);
                })
        );
        const b = vi.fn(
            () =>
                new Promise((_, reject) => {
                    res += "b";
                    reject();
                })
        );
        const c = vi.fn(
            () =>
                new Promise((resolve) => {
                    res += "c";
                    resolve();
                })
        );

        try {
            await runSeries([a, b, c]);
        } catch (e) {}

        expect(res).toBe("ab");
    });
});
