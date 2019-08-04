let verbosity = 0;

module.exports = {
    log: (...args) => {
        if(verbosity === 0)
            return;

        console.log(...args);
    },
    setVerbosity: (val) => {
        verbosity = val;
    }
};
