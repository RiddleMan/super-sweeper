module.exports = {
    '~/Downloads': {
        retention: '30d'
    },
    '~/Desktop': {
        retention: '30d',
        match: /^(Screenshot | Screen Recording )/
    }
};
