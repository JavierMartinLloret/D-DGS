import { edge } from "./edge";
import { node } from "./node";

export class Diagram {
    _id: string | undefined;
    domain_key: string;
    name: string;
    nodes: Array<node>;
    edges: Array<edge>;

    constructor(domain_key: string, name: string, nodes: Array<node>, edges: Array<edge>, _id?: string)
    {
        this._id = _id;
        this.domain_key = domain_key;
        this.name = name;
        this.nodes = nodes;
        this.edges = edges;
    }
}