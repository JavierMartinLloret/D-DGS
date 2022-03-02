export class Activity {
    domain_key: String;
    name: String;
    description: String;

    constructor(domain_key: String, name: String, description: String)
    {
        this.name = (name) ? name : "";
        this.description = (description) ? description : "";
        this.domain_key = domain_key;
    }
}