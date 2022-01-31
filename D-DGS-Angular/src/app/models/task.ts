export class Task {
    name: String;
    description: String;

    constructor(name: String, description: String)
    {
        this.name = (name) ? name : "";
        this.description = (description) ? description : "";
    }
}