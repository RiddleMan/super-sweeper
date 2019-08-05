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

const configPath = argv.config
    ? path.resolve(process.cwd(), argv.config)
    : './config.sample.js';

require('./src/sweeper').clean({
    options: {
        dry: argv.dry
    },
    paths: require(configPath)
});
