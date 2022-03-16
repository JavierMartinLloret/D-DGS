export class Line {
    _id: String | undefined;
    domain_key: String;
    activities: String[];
    rewards: String[];

    constructor(domain_key: String, activities: String[], rewards: String[], _id?: String)
    {
        this.domain_key = domain_key;
        this.activities = activities;
        this.rewards = rewards;
        this._id = _id;
    }
}