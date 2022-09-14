import { node } from "./node";
import { edge } from "./edge";

export class SubStrategy {
    _id: String | undefined;
    name: string = "";
    nodes: any[] = [];
    edges: any[] = [];
    
    constructor(name: string, nodes: node[], edges: edge[]) {
        this.name = name;
        this.nodes = nodes;
        this.edges = edges;
    }
}