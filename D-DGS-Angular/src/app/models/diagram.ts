export class Diagram {
    _id: String | undefined;
    lines: String[];

    constructor(lines: String[], _id?: String)
    {
        this.lines = lines;
        this._id = _id;
    }
}