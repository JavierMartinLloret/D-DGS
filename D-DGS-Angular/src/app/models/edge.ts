export class edge {
    _id: string | undefined; // MONGODB
    idInDiagram: number; // Vis.js Network ID
    from: number;
    to: number;
    arrows: string;
    value: number;

    constructor(id: number, from: number, to: number, arrows: string, value: number, _id?: string)
    {
        this._id = _id;
        this.idInDiagram = id;
        this.from = from;
        this.to = to;
        this.arrows = arrows;
        this.value = value;
    }
}