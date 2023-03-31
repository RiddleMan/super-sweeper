let _homedir = "/home/h4x0r";

export const __setHomeDir = (dir) => (_homedir = dir);
export const homedir = () => _homedir;
