export class edge {
    _id: string | undefined; // MONGODB
    idInDiagram: string; // Vis.js Network ID
    from: string;
    to: string;
    arrows: string;
    value: number;

    constructor(id: string, from: string, to: string, arrows: string, value: number, _id?: string)
    {
        this._id = _id;
        this.idInDiagram = id;
        this.from = from;
        this.to = to;
        this.arrows = arrows;
        this.value = value;
    }
}