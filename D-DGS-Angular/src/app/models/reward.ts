export class Reward {
    domain_key: String;
    name: String;
    description: String;

    constructor(domain_key: String, name: String, description: String) {
        this.domain_key = (domain_key) ? domain_key : "";
        this.name = name;
        this.description = description;
    }
}