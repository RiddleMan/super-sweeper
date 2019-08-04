const path = require('path');
module.exports = {
    [path.resolve(process.env.HOME, 'Downloads')]: {
        retention: '30d'
    },
    [path.resolve(process.env.HOME, 'Desktop')]: {
        retention: '30d',
        match: /^(Screenshot | Screen Recording )/
    }
};
