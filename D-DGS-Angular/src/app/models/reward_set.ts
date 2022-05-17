export class Reward_Set {
    _id: String | undefined;
    name: String;
    domain_key: String;

    constructor(name: String, domain_key: String, _id?: String)
    {
        this.name = name;
        this.domain_key = domain_key;
        this._id = _id;
    }
}