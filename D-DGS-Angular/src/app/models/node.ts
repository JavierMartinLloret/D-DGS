export class node {
    _id: string | undefined; // MONGODB
    idInDiagram: string; // Vis.js Network ID
    label: string;
    shape: string;
    color: string;
    type: string;
    base_element_id: string | undefined;

    constructor(id: string, label: string, shape: string, color: string, type: string, base_element_id: string, _id?: string)
    {
        this._id = _id;
        this.idInDiagram = id;
        this.label = label;
        this.shape = shape;
        this.color = color;
        this.type = type;
        this.base_element_id = base_element_id;
    }
}