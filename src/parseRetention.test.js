const parseRetention = require('./parseRetention');

test('should return a date 1 day back', () => {
    const startDate = new Date(2019, 8, 1);

    const actual = parseRetention(startDate)('1d');

    expect(actual.getTime())
        .toBe(new Date(2019,7, 31).getTime());
});

test('should return a date 1 hour back', () => {
    const startDate = new Date(2019, 8, 1, 2);

    const actual = parseRetention(startDate)('1h');

    expect(actual.getTime())
        .toBe(new Date(2019,8, 1, 1).getTime());
});

test('should return a date 2 hours back', () => {
    const startDate = new Date(2019, 8, 1, 2);

    const actual = parseRetention(startDate)('2h');

    expect(actual.getTime())
        .toBe(new Date(2019,8, 1, 0).getTime());
});

test('should return a date 2 years back', () => {
    const startDate = new Date(2019, 1, 1);

    const actual = parseRetention(startDate)('2Y');

    expect(actual.getTime())
        .toBe(new Date(2017,1, 1).getTime());
});

test('should return a date 10 minutes back', () => {
    const startDate = new Date(2019, 1, 1, 0, 44);

    const actual = parseRetention(startDate)('10m');

    expect(actual.getTime())
        .toBe(new Date(2019,1, 1, 0, 34).getTime());
});

test('should return a date 3 months back', () => {
    const startDate = new Date(2019, 8, 1);

    const actual = parseRetention(startDate)('3M');

    expect(actual.getTime())
        .toBe(new Date(2019,5, 3).getTime());
});

test('should return a date 3 months back', () => {
    const startDate = new Date(2019, 8, 1, 1);

    const actual = parseRetention(startDate)('600s');

    expect(actual.getTime())
        .toBe(new Date(2019,8, 1, 0, 50).getTime());
});
