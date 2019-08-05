const path = require('path');
const fs = jest.genMockFromModule('fs');

let mockFiles = {};
const __setMockFiles = (files) => {
    mockFiles = files;
};

const readdir = (directoryPath, cb) => {
    cb(null, Object.keys(mockFiles) || []);
};

const stat = (cleanPath, cb) => {
    const name = path.basename(cleanPath);

    cb(null, mockFiles[name]);
};

fs.__setMockFiles = __setMockFiles;

fs.stat = jest.fn(stat);
fs.readdir = jest.fn(readdir);
fs.unlink = jest.fn((path, cb) => cb());

module.exports = fs;
