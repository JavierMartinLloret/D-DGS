export class Activity_Tasks {
    // No sé si existe un tipo concreto para los Ids...
    activity: String;
    tasks: String[];

    constructor(activity: String, tasks: String[])
    {
        this.activity = activity;
        this.tasks = tasks;
    }
}