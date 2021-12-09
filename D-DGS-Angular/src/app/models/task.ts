import { Activity } from "./activity";

export class Task {
    name: String;
    description: String;
    activity: Activity;

    constructor(name: String, description: String, activity: Activity)
    {
        this.name = (name) ? name : "";
        this.description = (description) ? description : "";
        this.activity = activity; // CAN'T BE NULL
    }
}