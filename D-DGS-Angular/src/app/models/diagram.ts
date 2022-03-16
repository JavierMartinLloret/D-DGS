export class Diagram {
    _id: String | undefined;
    domain_key: String;
    lines: String[];

    constructor(domain_key: String, lines: String[], _id?: String)
    {
        this.domain_key = domain_key;
        this.lines = lines;
        this._id = _id;
    }
}