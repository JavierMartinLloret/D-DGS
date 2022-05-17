export class Reward {
    _id: String | undefined;
    parent_set: String;
    name: String;
    description: String;
    priority: Number;

    constructor(parent_set: String, name: String, description: String, priority: Number) {
        this.parent_set = parent_set
        this.name = name;
        this.description = description;
        this.priority = priority;
    }
}