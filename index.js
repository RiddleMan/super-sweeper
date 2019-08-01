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
    .help('h')
    .alias('h', 'help')
    .argv;

