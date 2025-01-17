import express from 'express';
import mongoose from "mongoose";
import mongoDb from "./mongoDb";
import config from "./config";
import usersRouter from "./routes/users/users";
import tasksRouter from "./routes/tasks/tasks";

const app = express();
const port = 8000;

app.use(express.json());
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on('exit', err => {
        mongoDb.disconnect();
    })
};

run().catch(e => console.error(e));


