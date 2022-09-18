import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from 'src/app/models/activity_property';
import { Context } from 'src/app/models/context';
import { Linker } from 'src/app/models/linker';
import { Reward } from 'src/app/models/reward';
import { Reward_Set } from 'src/app/models/reward_set';
import { Strategy } from 'src/app/models/strategy';
import { SubStrategy } from 'src/app/models/substrategy';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { StrategiesService } from 'src/app/services/strategies.service';
import { DataSet } from "vis-data";
import { Network } from "vis-network";

const LOG_TOKEN: string = "LOG_TOKEN";
const DIAGRAM_TOKEN: string = "DIAGRAM_EDITION_ENABLE"; // 'y' | 'n'

/* SUBSTRATEGY NODE */
const DEFAULT_SUBSTRATEGY_SHAPE : string = "square";
const DEFAULT_SUBSTRATEGY_COLOR : string = "blue";

/* ACTIVITY NODE */
const DEFAULT_ACTIVITY_SHAPE : string = "box";
const DEFAULT_ACTIVITY_COLOR : string = "#CC4E00";

/* PROPERTY NODE */
const DEFAULT_PROPERTY_SHAPE : string = "ellipse";
const DEFAULT_PROPERTY_COLOR : string = "#FFDDA6";

/* ABSOLUT_VALUE */
const DEFAULT_ABSOLUTE_SHAPE : string = "circle";
const DEFAULT_ABSOLUTE_COLOR : string = "#FFD9D9";

/* LINKER NODE */
const DEFAULT_LINKER_SHAPE : string = "diamond";
const DEFAULT_LINKER_COLOR : string = "#00C2A8";

/* REWARD NODE */
const DEFAULT_REWARD_SHAPE : string = "star"; 
const DEFAULT_REWARD_COLOR : string = "#FCCE14";

/* EDGE ACTIVITY-PROPERTY */

/* NODEREFERENCE DEFAULT VALUES */
const DEFAULT_NODE_TYPE_CODE_STRING: string = 's';
const DEFAULT_NODE_TYPE_CODE_NUMBER: string = 'n';
const DEFAULT_NODE_TYPE_CODE_DATE  : string = 'd';
const DEFAULT_NODE_TYPE_CODE_OBJECT_SUBSTRATEGY: string = 'o_s';
const DEFAULT_NODE_TYPE_CODE_OBJECT_ACTIVITY: string = 'o_a';
const DEFAULT_NODE_TYPE_CODE_OBJECT_PROPERTY: string = 'o_p';
const DEFAULT_NODE_TYPE_CODE_OBJECT_LINKER: string = 'o_l';
const DEFAULT_NODE_TYPE_CODE_OBJECT_REWARD: string = 'o_r';

interface nodeReference {
  idInDiagram: number,
  nodeType: string, /* 's'== string, 'n' == number, 'd' == Date, 'o' == Object */
  value: string        /* s,n,o == value. Object == _id for service to call*/
}

@Component({
  selector: 'app-desing-strategy',
  templateUrl: './desing-strategy.component.html',
  styleUrls: ['./desing-strategy.component.css']
})
export class DesingStrategyComponent implements AfterViewInit {

  

  // Domain_Key
  public DOMAIN_KEY: string="";
  
  // Containers
  public localDomain: Context = new Context("","",undefined);
  public localRewardSet: Reward_Set = new Reward_Set("","",undefined);
  public localSubstrategies: Array<SubStrategy> = new Array<SubStrategy>();
  public localNodes: Array<any> = new Array<any>();
  public localEdges: Array<any> = new Array<any>();
  public nodeReferences: Array<any> = new Array<any>();
  public activitiesFromTheDomain: Array<Activity> = [];
  public linkers: Array<Linker> = [];
  public linkerCategories: Set<string> = new Set<string>();
  public localRewards: Array<Reward> = [];

  public avaliableNodesToLinkWithNodeClicked: Set<any> = new Set<any>();

  // Local variables
  public localStrategy: Strategy = new Strategy("","","", this.localDomain, this.localRewardSet, this.localNodes, this.localEdges, this.nodeReferences);
  public nodeIDCounter: number = 0;
  public edgeIDCounter: number = 0;
  public newSubstrategyName: string = "";
  public activityToAddSelected: Activity = new Activity("","","");
  public linkerCategorySelected: string = "";
  public linkerToAddSelected: Linker = new Linker("","",undefined);
  public rewardToAddSelected: Reward = new Reward("","","",0);
  public newAbsoluteValueType: string = "";
  public newAbsoluteValue: any = "";

  public nodeClicked: any /* node */;
  public nodeToLinkWithClickedOne : any /* node */;


  // Flags
  public userIsAdmin: boolean = false;
  public userOwnsTheStrategy: boolean = false;
  public editDiagramFunctionsAvaliable: boolean = false;

  public isAddSubstrategyClicked: boolean = false;
  public isAddActivityClicked: boolean = false;
  public isAddAbsoluteValueClicked: boolean = false;
  public isAddLinkerClicked: boolean = false;
  public isAddRewardClicked: boolean = false;

  public isANodeSelected: boolean = false;

  // Diagram-Related Variables
  public diagram: any;
  public nodes: any;
  public edges: any;
  public data: any;
  public options: any;
  public network: any;

  

  constructor(private _strategiesService: StrategiesService, private _router: Router, private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    let diagramViewMode = sessionStorage.getItem(DIAGRAM_TOKEN);

    if(aux)
    {
      this.DOMAIN_KEY = aux;
      let strategyID = this._router.url.split('/').pop();
      if(strategyID)
      {
        this._strategiesService.getASpecificStrategy(strategyID).subscribe((res1: any) => {
          this.localStrategy = res1;
          // If there's nodes in the Strategy, we rebuild it to the last version of it.
          if(this.localStrategy.nodes.length > 0) {
            this.nodes.add(this.localStrategy.nodes);
            this.edges.add(this.localStrategy.edges);
            this.nodeIDCounter = this.nodes.length;
            this.edgeIDCounter = this.edges.length;
          }

          // We read the current Strategy and check if user has it's ownership.
          this._strategiesService.getAllStrategiesFromAnSpecificUser(this.DOMAIN_KEY).subscribe((res2: any) => {
            let userStrategies: Array<Strategy> = res2;
            userStrategies.forEach((s: Strategy) => {
              if(s._id == this.localStrategy._id)
                this.userOwnsTheStrategy = true;
            });
            if(!this.userOwnsTheStrategy)
              this._router.navigateByUrl('/main');
          })

          // We load all activities avaliable
          if(this.localStrategy.domain._id)
            this._diagramDomainService.getActivitiesFromAContext(this.localStrategy.domain._id.toString()).subscribe((res:any) => this.activitiesFromTheDomain = res);

          // We load all rewards avaliable
          if(this.localStrategy.reward_set._id)
            this._diagramDomainService.getRewardsOfACertainSet(this.localStrategy.reward_set._id.toString()).subscribe((untypedRewards: any) => this.localRewards = untypedRewards);

        });
      }
      // Load al linkers avaliable
      this._diagramDomainService.getAllLinkers().subscribe((untypedLinkers: any) => {
        this.linkers = untypedLinkers;
        // Extremely inneficient
        this.linkers.forEach((l: Linker) => {
          this.linkerCategories.add(l.category);
        });
      })

      if(diagramViewMode)
        this.editDiagramFunctionsAvaliable = (diagramViewMode == "y") ? true : false;
    }
    else
      this._router.navigateByUrl('/main');
  }

  ngAfterViewInit(): void {
    
    this.nodes = document.getElementById("nodesID"); // unnecesary
    this.diagram = document.getElementById("diagramID");
    
    this.nodes = new DataSet();

    this.edges = new DataSet();

    this.data = {
      nodes: this.nodes,
      edges: this.edges
    };

    this.options = {};

    if(this.diagram != null)
    {
      this.network = new Network(this.diagram, this.data, this.options);
    }
  }

  unlogUser(): void {sessionStorage.removeItem(LOG_TOKEN);}

  addSubstrategyIsClicked(): void {
    this.isAddSubstrategyClicked = this.isAddSubstrategyClicked ? false : true;
    
    this.isAddActivityClicked = false;
    this.isAddAbsoluteValueClicked = false;
    this.isAddLinkerClicked = false;
    this.isAddRewardClicked = false;
    this.isANodeSelected = false;
  }

  addSubstrategyToDiagram(): void {
    let newNode: any = {
      id: this.nodeIDCounter,
      label: this.newSubstrategyName,
      shape: DEFAULT_SUBSTRATEGY_SHAPE,
      color: DEFAULT_SUBSTRATEGY_COLOR
    };
    let newNodeReference: nodeReference = {
      idInDiagram: newNode.id,
      nodeType: DEFAULT_NODE_TYPE_CODE_OBJECT_SUBSTRATEGY,
      value: this.newSubstrategyName
    };
    this.nodeIDCounter++;
    
    this.localStrategy.node_references.push(newNodeReference);
    this.nodes.add(newNode);
    this.localStrategy.nodes.push(newNode);

    this.newSubstrategyName = "";
    this.isAddSubstrategyClicked = false;
    this.updateStrategy();
  }

  addActivityIsClicked(): void {
    this.isAddActivityClicked = this.isAddActivityClicked ? false : true;
  
    this.isAddSubstrategyClicked = false;
    this.isAddAbsoluteValueClicked = false;
    this.isAddLinkerClicked = false;
    this.isAddRewardClicked = false;
    this.isANodeSelected = false;
  }

  addActivityToDiagram(): void {
    if(this.activityToAddSelected._id)
    {
      let newNode : any = {
        id: this.nodeIDCounter,
        label: this.activityToAddSelected.name.toString(),
        shape: DEFAULT_ACTIVITY_SHAPE,
        color: DEFAULT_ACTIVITY_COLOR
      };
      let newNodeReference : nodeReference = {
        idInDiagram: this.nodeIDCounter,
        nodeType: DEFAULT_NODE_TYPE_CODE_OBJECT_ACTIVITY,
        value: this.activityToAddSelected._id?.toString()
      }
      this.nodeIDCounter++;
      
      this.localStrategy.node_references.push(newNodeReference);
      this.nodes.add(newNode);
      this.localStrategy.nodes.push(newNode);

      this.addPropertiesFromTheActivityToDiagram();
  
      this.updateStrategy();
  
      this.isAddActivityClicked = false;
      this.activityToAddSelected = new Activity("","","");
    }
  }

  addPropertiesFromTheActivityToDiagram(): void {
    if(this.activityToAddSelected._id)
    {
      this._diagramDomainService.getPropertiesFromAnActivity(this.activityToAddSelected._id.toString()).subscribe((res: any) => {
        let properties: Set<Activity_Property> = res;
        let newNodes: Array<any> = [];
        let newEdges: Array<any> = [];
        let activityNodeID: number = this.nodeIDCounter-1;

        properties.forEach((p: Activity_Property) => {
          if(p._id)
          {
            let newNode : any = {
              id: this.nodeIDCounter,
              label: p.name,
              shape: DEFAULT_PROPERTY_SHAPE,
              color: DEFAULT_PROPERTY_COLOR
            };
            let newNodeReference : nodeReference = {
              idInDiagram: this.nodeIDCounter,
              nodeType: DEFAULT_NODE_TYPE_CODE_OBJECT_PROPERTY,
              value: p._id?.toString()
            }
  
            this.localStrategy.node_references.push(newNodeReference);
            newNodes.push(newNode);
            this.localStrategy.nodes.push(newNode);
  
            let newEdge: any = {
              id: this.edgeIDCounter,
              from: activityNodeID,
              to: this.nodeIDCounter,
            }
  
            newEdges.push(newEdge);
            this.localStrategy.edges.push(newEdge);
  
            this.nodeIDCounter++;
            this.edgeIDCounter++;
          }
        });

        this.nodes.add(newNodes);
        this.edges.add(newEdges);
        this.updateStrategy();
      })
    }
  }

  addLinkerIsClicked(): void {
    this.isAddLinkerClicked = this.isAddLinkerClicked ? false : true;
  
    this.isAddSubstrategyClicked = false;
    this.isAddAbsoluteValueClicked = false;
    this.isAddRewardClicked = false;
    this.isAddActivityClicked = false;
    this.isANodeSelected = false;
  }

  addLinkerToDiagram(): void {
    if(this.linkerToAddSelected._id)
    {
      let newNode : any = {
        id: this.nodeIDCounter,
        label: this.linkerToAddSelected.name,
        shape: DEFAULT_LINKER_SHAPE,
        color: DEFAULT_LINKER_COLOR
      };
      let newNodeReference : nodeReference = {
        idInDiagram: this.nodeIDCounter,
        nodeType: DEFAULT_NODE_TYPE_CODE_OBJECT_LINKER,
        value: this.linkerToAddSelected._id
      };
      this.nodeIDCounter++;
  
      this.localStrategy.node_references.push(newNodeReference);
      this.nodes.add(newNode);
      this.localStrategy.nodes.push(newNode);
      this.updateStrategy();
      this.isAddLinkerClicked = false;
      this.linkerToAddSelected = new Linker("","",undefined);
      this.linkerCategorySelected = "";
    }
  }

  addAbsoluteValueIsClicked(): void {
    this.isAddAbsoluteValueClicked = this.isAddAbsoluteValueClicked ? false : true;
  
    this.isAddSubstrategyClicked = false;
    this.isAddLinkerClicked = false;
    this.isAddRewardClicked = false;
    this.isAddActivityClicked = false;
    this.isANodeSelected = false;
  }

  addAbsoluteValueToDiagram(): void {
    let nodeLabel: string = "";
    let nodeReferenceType: string = "";
    switch (this.newAbsoluteValueType) {
      case 'T':
        nodeLabel = this.newAbsoluteValue;
        nodeReferenceType = DEFAULT_NODE_TYPE_CODE_STRING;
        break;
      case 'N':
        nodeLabel = this.newAbsoluteValue.toString();
        nodeReferenceType = DEFAULT_NODE_TYPE_CODE_NUMBER;
        break;
      case 'D':
        nodeLabel = "Date: "+this.newAbsoluteValue;
        nodeReferenceType = DEFAULT_NODE_TYPE_CODE_DATE;
        break;
      default:
        console.log("Error selecting a tag for an absolute value node");
        break;
    }
    
    let newNode : any = {
      id: this.nodeIDCounter,
      label: nodeLabel,
      shape: DEFAULT_ABSOLUTE_SHAPE,
      color: DEFAULT_ABSOLUTE_COLOR
    };
    let newNodeReference : nodeReference = {
      idInDiagram: this.nodeIDCounter,
      nodeType: nodeReferenceType,
      value: this.newAbsoluteValue
    };
    this.nodeIDCounter++;
    this.localStrategy.node_references.push(newNodeReference);
    this.nodes.add(newNode);
    this.localStrategy.nodes.push(newNode);
    this.updateStrategy();
    this.isAddAbsoluteValueClicked = false;
    this.newAbsoluteValue = this.newAbsoluteValueType = "";
  }

  addRewardIsClicked(): void {
    this.isAddRewardClicked = this.isAddRewardClicked ? false : true;
  
    this.isAddSubstrategyClicked = false;
    this.isAddAbsoluteValueClicked = false;
    this.isAddLinkerClicked = false;
    this.isAddActivityClicked = false;
    this.isANodeSelected = false;
  }

  addRewardToDiagram(): void {
    if(this.rewardToAddSelected._id)
    {
      let newNode : any = {
        id: this.nodeIDCounter,
        label: this.rewardToAddSelected.name.toString(),
        shape: DEFAULT_REWARD_SHAPE,
        color: DEFAULT_REWARD_COLOR
      };
      let newNodeReference : nodeReference = {
        idInDiagram: this.nodeIDCounter,
        nodeType: DEFAULT_NODE_TYPE_CODE_OBJECT_REWARD,
        value: this.rewardToAddSelected._id?.toString()
      };
      this.nodeIDCounter++;
  
      this.localStrategy.node_references.push(newNodeReference);
      this.nodes.add(newNode);
      this.localStrategy.nodes.push(newNode);
      this.updateStrategy();
      this.isAddRewardClicked = false;
      this.rewardToAddSelected = new Reward("","","",0);
    }
  }

  diagramIsClicked(): void {

    // A node has been selected
    if(this.getNodeSelected() != undefined)
    {
      this.nodeClicked = this.getNodeSelected();
      this.isANodeSelected = true;
      this.isAddSubstrategyClicked = false;
      this.isAddAbsoluteValueClicked = false;
      this.isAddLinkerClicked = false;
      this.isAddActivityClicked = false;
      this.isAddRewardClicked = false;

      // Prepare the nodes avaliable for clicking in the link two nodes. Prepare data to erase the node
      this.avaliableNodesToLinkWithNodeClicked = new Set<any>();
      let allNodes: Set<any> = this.getNodesCurrentlyOnDiagram();
      allNodes.forEach((n: any) => {
        if(n.id != this.nodeClicked.id)
          this.avaliableNodesToLinkWithNodeClicked.add(n);
      })
    }
    else
    {
      this.nodeClicked = this.nodeToLinkWithClickedOne = undefined;
      this.isANodeSelected = false;
    }
    
  }

  linkTwoNodes(): void {
    // We seek the node type
    let nodeClickedReference: nodeReference = {idInDiagram:-1,nodeType:"",value:""};
    let nodeToBeLinkedWithReference: nodeReference = {idInDiagram:-1,nodeType:"",value:""};
    this.localStrategy.node_references.forEach((n:nodeReference) =>{
      if(n.idInDiagram == this.nodeClicked.id)
        nodeClickedReference = n; 
      if(n.idInDiagram == this.nodeToLinkWithClickedOne.id)
        nodeToBeLinkedWithReference = n;
    })
    
    let newEdge: any;

    // We seek how many edges this node has already
    let currentEdgeOrder: number = this.getNumOfEdgesFromThisNode(this.nodeClicked.id);
    currentEdgeOrder++;

    switch (nodeClickedReference.nodeType) {
      case DEFAULT_NODE_TYPE_CODE_OBJECT_LINKER:
        {
          newEdge = {
            id: this.edgeIDCounter,
            from: this.nodeToLinkWithClickedOne.id,
            to: this.nodeClicked.id,
            label: currentEdgeOrder.toString(),
            arrows: 'to'
          };
        }break;        
      case DEFAULT_NODE_TYPE_CODE_OBJECT_SUBSTRATEGY:
        {
          newEdge = {
            id: this.edgeIDCounter,
            from: this.nodeToLinkWithClickedOne.id,
            to: this.nodeClicked.id
          };
        }break;
      default:
        {
          newEdge = {
            id: this.edgeIDCounter,
            from: this.nodeToLinkWithClickedOne.id,
            to: this.nodeClicked.id
          };
        }break;
    };

    /*
    */

    this.edgeIDCounter++;
    
    this.edges.add(newEdge);
    this.localStrategy.edges.push(newEdge);
    this.updateStrategy();
    this.isANodeSelected = false;
    this.nodeToLinkWithClickedOne = this.nodeClicked = undefined;
  }

  updateStrategy(): void {
    this._strategiesService.updateAStrategy(this.localStrategy).subscribe((res: any) => {});
  }

  /* INTERACTION WITH THE DIAGRAM METHODS. SHOULD BE A SERVICE */

  goToEnableMode(): void
  {
    sessionStorage.setItem(DIAGRAM_TOKEN, "y");
    window.location.reload();
  }

  private getNodeSelected(): any | undefined /*node*/ {
    let auxNode : any;
    if(this.network.getSelectedNodes().length > 0)
    {
      let selectedNodesIds: Array<any> = this.network.getSelectedNodes();
      let selectedNodeId : number = selectedNodesIds[0];

      auxNode = {
        id: this.network.body.nodes[selectedNodeId].options.id,
        label: this.network.body.nodes[selectedNodeId].options.label,
        shape: this.network.body.nodes[selectedNodeId].options.shape,
        color: this.network.body.nodes[selectedNodeId].options.color.background
      };
    }
    else
    auxNode = undefined;
        

    return auxNode;
  }

  private getNodesCurrentlyOnDiagram(): Set<any> {
    let nodes : Set<any> = new Set<any>();
    let nodesIds : Array<number> = this.nodes.getIds();

    nodesIds.forEach((Id: number) => {
      let auxNode : any = {
        id: this.network.body.nodes[Id].options.id,
        label: this.network.body.nodes[Id].options.label,
        shape: this.network.body.nodes[Id].options.shape,
        color: this.network.body.nodes[Id].options.color.background
      };
      nodes.add(auxNode);
    });
    return nodes;
  }

  private getNumOfEdgesFromThisNode(nodeId: number): number
  {
    let cont: number = 0;
    let ocurrences: number = 0;
    while (this.network.body.edges[cont] != undefined) {
      if(this.network.body.edges[cont].toId == nodeId)
        ocurrences++;
      cont++;
    }

    return ocurrences;
  }

  private getEdgesFromThisNode(nodeId: number): Array<any> {
    let edges: Array<any> = [];
    let cont: number = 0;
    while (this.network.body.edges[cont] != undefined)
    {
      if(this.network.body.edges[cont].fromId == nodeId)
        edges.push({
          id: this.network.body.edges[cont].id,
          toId: this.network.body.edges[cont].toId,
          fromId: this.network.body.edges[cont].fromId
        })
    }

    return edges;
  }

  debug():void {
    console.log(this.localStrategy);
  };

}
