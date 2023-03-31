const getDateRangeValue = (dateRangeStr) => {
    const VALUES = {
        Y: 365 * 24 * 60 * 60 * 1000,
        M: 30 * 24 * 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        h: 60 * 60 * 1000,
        m: 60 * 1000,
        s: 1000
    };

    return VALUES[dateRangeStr];
};

const parseStr = (retentionStr) => {
    const value = parseFloat(retentionStr);
    const dateRange = getDateRangeValue(retentionStr[retentionStr.length - 1]);

    return value * dateRange;
};

export const parseRetention = (referenceDate) => (retentionStr) => {
    const unixTime = referenceDate.getTime() - parseStr(retentionStr);

    return new Date(unixTime);
};
