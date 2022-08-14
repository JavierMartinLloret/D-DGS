import { node } from "./node";
import { edge } from "./edge";
import { Context } from "./context";
import { Reward_Set } from "./reward_set";
import { SubStrategy } from "./substrategy";

export class Strategy {
    _id: string | undefined;
    domain_key: string = "";
    name: string = "";
    description: string = "";
    domain: Context = new Context("","",undefined);
    reward_set: Reward_Set = new Reward_Set("","",undefined);
    substrategies: SubStrategy[] = [];
    
    
    constructor(domain_key: string, name: string, description: string, domain: Context, reward_set: Reward_Set, substrategies: SubStrategy[]) {
        this.domain_key = domain_key;
        this.name = name;
        this.description = description;
        this.domain = domain;
        this.reward_set = reward_set;
        this.substrategies = substrategies;
    }
}