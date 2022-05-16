export class Activity {
    _id: String | undefined;
    context_ID: String;
    name: String;
    description: String;

    constructor(context_ID: String, name: String, description: String)
    {
        this.name = (name) ? name : "";
        this.description = (description) ? description : "";
        this.context_ID = context_ID;
    }
}