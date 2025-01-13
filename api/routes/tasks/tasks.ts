import express from "express";
import {Error} from "mongoose";
import auth, {RequestWithUser} from "../../middleware/auth";
import Task from "../../models/Task/Task";

const tasksRouter = express.Router();

tasksRouter.get("/", auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        if (!user) {
            res.status(401).send({ error: "Unauthorized" });
            return;
        }

        const tasks = await Task.find({ user: user._id });
        res.status(200).send(tasks);
    } catch (error) {
        next(error);
    }
})

tasksRouter.post("/", auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const { title, description, status } = req.body;

        const possibleStatuses = ['new', 'complete', 'in_progress'];
        if (!possibleStatuses.includes(status)) {
            res.status(400).send({ error: 'Possible statuses: new, complete and in_progress!' });
            return;
        }

        const task = new Task({
            user: user._id,
            title,
            description,
            status,
        });

        await task.save();

        res.status(201).send(task);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send({ error: error.message, details: error.errors });
            return;
        }
        next(error);
    }
});


export default tasksRouter;
