# Super sweeper

Super sweeper is a cleanup tool helping you regain control over messy folders.

## Installation
```
npm i -g super-sweeper
```

## Usage

```
> super-sweeper -h
Usage: super-sweeper <command> [options]

Options:
  --version        Show version number                                 [boolean]
  -v, --verbose                                                        [boolean]
  -r, --retention  Retention expressed in format: 30d, 4h, 10m  [default: "30d"]
  -p, --path       Path to cleanup
  -c, --config     Path to config file with paths to cleanup            [string]
  --dry            Simulates a cleanup                [boolean] [default: false]
  -h, --help       Show help                                           [boolean]

Examples:
  Run with default config for ~/Downloads and ~/Desktop (screenshots only). 30
  days retention.
    $ super-sweeper

  Run for custom path with user-defined retention.
    $ super-sweeper --path your/path/here/ --retention 1h

  Run for custom config
    # config.js
    module.exports = {
      'your/path/here': {
        retention: '1h',
        match: /^DCIM/
      }
    }

    $ super-sweeper --config ./config.js
```

## Configuration

The tool accepts configs in following format:

```js
module.exports = {
    '/path/to/a/folder/': {
        retention: '30d', // Ex. 1Y, 1M, 10d, 20h, 60m, 30s
        match: /^DCIM/ // JS RegExp matching files to remove
    }, 
    '/another/path': {} // Take all defaults. Retention 30d, match all
}
```
