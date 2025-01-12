import { Db, MongoClient } from "mongodb";

let client: MongoClient;
let usersDb: Db;
let tasksDb: Db;

const connect = async () => {
    client = await MongoClient.connect("mongodb://localhost");
    usersDb = client.db("users");
    tasksDb = client.db("tasks");
};

const disconnect = async () => {
    if (client) {
        await client.close();
    }
};

const mongoDb = {
    connect,
    disconnect,
    getUsersDb: () => usersDb,
    getTasksDb: () => tasksDb,
};

export default mongoDb;
