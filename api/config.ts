import path from "path";

const pathName = __dirname;

const config = {
    pathName,
    publicPath: path.join(pathName, 'public'),
    db: 'mongodb://localhost/toDoList',
};

export default config;


