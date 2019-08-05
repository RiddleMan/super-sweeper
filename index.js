const yargs = require('yargs');
const logger = require('./src/logger');
const path = require('path');

const argv = yargs
    .scriptName('super-sweeper')
    .usage('Usage: $0 <command> [options]')
    .option('v', {
        alias: 'verbose',
        boolean: true,
        desc: 'Gimme moar output'
    })
    .option('r', {
        alias: 'retention',
        desc: 'Retention expressed in format: 30d, 4h, 10m',
        default: '30d'
    })
    .option('p', {
        alias: 'path',
        desc: 'Path to cleanup'
    })
    .option('c', {
        alias: 'config',
        string: true,
        desc: 'Path to config file with paths to cleanup'
    })
    .option('dry', {
        boolean: true,
        desc: 'Simulates a cleanup',
        default: false
    })
    .help('h')
    .alias('h', 'help')
    .argv;

logger.setVerbosity(argv.v ? 1 : 0);

if (argv.path && argv.config) {
    console.log('Decide whether you want use a config or a path.');
    process.exit(1);
}

const getPaths = () => {
    if (argv.config) {
        return require(path.resolve(process.cwd(), argv.config));
    } else if (argv.path) {
        return {
            [argv.path]: {
                ...(argv.retention
                        ? { retention: argv.retention }
                        : {}
                )
            }
        };
    } else {
        return require('./config.sample');
    }
};

require('./src/sweeper').clean({
    options: {
        dry: argv.dry
    },
    paths: getPaths()
});
