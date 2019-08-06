const os = jest.genMockFromModule('os');

let homedir = '/home/h4x0r';
os.__setHomeDir = (dir) => homedir = dir;
os.homedir = () => homedir;

module.exports = os;
