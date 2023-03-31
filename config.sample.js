export default [
    {
        path: '~/Downloads',
        retention: '30d'
    },
    {
        path: '~/Desktop',
        retention: '30d',
        match: /^(Screenshot |Screen Recording )/
    }
];
