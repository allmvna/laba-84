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
});

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

tasksRouter.put("/:id", auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        if (!user) {
            res.status(401).send({ error: "Unauthorized" });
            return;
        }

        const { id } = req.params;
        const { title, description, status } = req.body;

        const possibleStatuses = ["new", "complete", "in_progress"];
        if (status && !possibleStatuses.includes(status)) {
            res.status(400).send({ error: "Possible statuses: new, complete and in_progress!" });
            return;
        }

        const task = await Task.findOne({ _id: id });
        if (!task) {
            res.status(404).send({ error: "Task not found" });
            return;
        }

        if (task.user.toString() !== user._id.toString()) {
            res.status(403).send({ error: "Forbidden: You are not allowed to edit this task" });
            return;
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;

        await task.save();

        res.status(200).send(task);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send({ error: error.message, details: error.errors });
            return;
        }
        next(error);
    }
});

tasksRouter.delete("/:id", auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        if (!user) {
            res.status(401).send({ error: "Unauthorized" });
            return;
        }

        const { id } = req.params;

        const task = await Task.findOne({ _id: id });
        if (!task) {
            res.status(404).send({ error: "Task not found" });
            return;
        }

        if (task.user.toString() !== user._id.toString()) {
            res.status(403).send({ error: "Forbidden: You are not allowed to delete this task" });
            return;
        }

        await task.deleteOne();

        res.status(200).send({ message: "Task deleted successfully" });
    } catch (error) {
        next(error);
    }
});


export default tasksRouter;
