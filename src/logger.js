let verbosity = 0;

export const log = (...args) => {
    if (verbosity === 0) return;

    console.log(...args);
};

export const setVerbosity = (val) => {
    verbosity = val;
};
