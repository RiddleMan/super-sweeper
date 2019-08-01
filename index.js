const yargs = require('yargs');

yargs
    .scriptName('super-sweeper')
    .usage('Usage: $0 <command> [options]')
    .option('v', {
        alias: 'verbose',
        boolean: true,
        desc: 'Gimme moar output'
    })
    .option('q', {
        alias: 'quiet',
        boolean: true,
        desc: 'No input baby'
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
    .help('h')
    .alias('h', 'help')
    .argv;

