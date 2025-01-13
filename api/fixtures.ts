import mongoose from 'mongoose';
import config from "./config";
import User from "./models/User/User";
import Task from "./models/Task/Task";
import {randomUUID} from "crypto";


const run = async () => {

    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('tasks');
    } catch (e) {
        console.log("Collections does not exist, skipping drop...");
    }


    const [nika, alex, mike] = await User.create([
        { username: "Nika", password: "123", token: randomUUID() },
        { username: "Alex", password: "456", token: randomUUID() },
        { username: "Mike", password: "789", token: randomUUID() }
    ]);

    await Task.create([
        {
            user: nika._id,
            title: "Download the app",
            description: "Download the app and register",
            status: "new",
        },
        {
            user: alex._id,
            title: "Write a resume",
            description: "Write a resume and send it by mail",
            status: "in_progress",
        },
        {
            user: mike._id,
            title: "Wash the car",
            description: "Wash the car and take it to the parking lot",
            status: "complete",
        },
    ]);
    await db.close();
};


run().catch(console.error);