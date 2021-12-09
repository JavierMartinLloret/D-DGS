import { Task } from "./task";

export class Activity {
    name: String;
    description: String;
    tasks: Task[];

    constructor(name: String, description: String, tasks: Task[])
    {
        this.name = (name) ? name : "";
        this.description = (description) ? description : "";
        this.tasks = tasks; // CAN'T BE NULL
    }
}