const path = require('path');
const fs = jest.genMockFromModule('fs/promises');

let mockFiles = {};
const __setMockFiles = (files) => {
    mockFiles = files;
};

const readdir = async () => 
  Object.keys(mockFiles) ?? [];

const stat = async (cleanPath) => {
    const name = path.basename(cleanPath);

    return mockFiles[name];
};

fs.__setMockFiles = __setMockFiles;

fs.stat = jest.fn(stat);
fs.readdir = jest.fn(readdir);
fs.unlink = jest.fn();

module.exports = fs;
