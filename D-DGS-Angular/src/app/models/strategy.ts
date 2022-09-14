import { node } from "./node";
import { edge } from "./edge";
import { Context } from "./context";
import { Reward_Set } from "./reward_set";
import { SubStrategy } from "./substrategy";

interface nodeReference {
    idInDiagram: number,
    nodeType: string, /* 's'== string, 'n' == number, 'd' == Date, 'o' == Object */
    value: string        /* s,n,o == value. Object == _id for service to call*/
}

export class Strategy {
    _id: string | undefined;
    domain_key: string = "";
    name: string = "";
    description: string = "";
    domain: Context = new Context("","",undefined);
    reward_set: Reward_Set = new Reward_Set("","",undefined);
    nodes: Array<any> = new Array<any>();
    edges: Array<any> = new Array<any>();
    node_references: Array<any> = new Array<any>();
    
    
    constructor(domain_key: string, name: string, description: string, domain: Context, reward_set: Reward_Set, nodes: Array<any>, edges: Array<any>, node_references: Array<any>) {
        this.domain_key = domain_key;
        this.name = name;
        this.description = description;
        this.domain = domain;
        this.reward_set = reward_set;
        this.nodes = nodes;
        this.edges = edges;
        this.node_references = node_references;
    }
}