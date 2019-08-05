const fs = jest.genMockFromModule('fs');

fs.unlink = jest.fn((path, cb) => cb());

module.exports = fs;
