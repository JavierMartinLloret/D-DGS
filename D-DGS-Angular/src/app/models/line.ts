export class Line {
    _id: String | undefined;
    activities: String[];
    rewards: String[];

    constructor(activities: String[], rewards: String[], _id?: String)
    {
        this.activities = activities;
        this.rewards = rewards;
        this._id = _id;
    }
}