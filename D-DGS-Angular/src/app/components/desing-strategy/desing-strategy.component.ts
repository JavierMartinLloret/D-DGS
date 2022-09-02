import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from 'src/app/models/activity_property';
import { Context } from 'src/app/models/context';
import { edge } from 'src/app/models/edge';
import { Linker } from 'src/app/models/linker';
import { node } from 'src/app/models/node';
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
const DEFAULT_SUBSTRATEGY_TYPE  : string = "substrategy";

/* ACTIVITY NODE */
const DEFAULT_ACTIVITY_SHAPE : string = "box";
const DEFAULT_ACTIVITY_COLOR : string = "#CC4E00";
const DEFAULT_ACTIVITY_TYPE  : string = "activity";

/* PROPERTY NODE */
const DEFAULT_PROPERTY_SHAPE : string = "ellipse";
const DEFAULT_PROPERTY_COLOR : string = "#FFDDA6";
const DEFAULT_PROPERTY_TYPE  : string = "property";

/* ABSOLUT_VALUE */
const DEFAULT_ABSOLUTE_SHAPE : string = "circle";
const DEFAULT_ABSOLUTE_COLOR : string = "#FFD9D9"
const DEFAULT_ABSOLUTE_TYPE  : string = "absolute";

/* LINKER NODE */
const DEFAULT_LINKER_SHAPE : string = "diamond";
const DEFAULT_LINKER_COLOR : string = "#00C2A8"
const DEFAULT_LINKER_TYPE  : string = "linker";

/* REWARD NODE */
const DEFAULT_REWARD_SHAPE : string = "star"; 
const DEFAULT_REWARD_COLOR : string = "#FCCE14"
const DEFAULT_REWARD_TYPE  : string = "reward";

/* EDGE ACTIVITY-PROPERTY */

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
  public activitiesFromTheDomain: Array<Activity> = [];
  public linkers: Array<Linker> = [];
  public linkerCategories: Set<string> = new Set<string>();
  public localRewards: Array<Reward> = [];

  // Local variables
  public localStrategy: Strategy = new Strategy("","","", this.localDomain, this.localRewardSet, this.localSubstrategies);
  public nodeIDCounter: number = 0;
  public newSubstrategyName: string = "";
  public activityToAddSelected: Activity = new Activity("","","");
  public linkerCategorySelected: string = "";
  public linkerToAddSelected: Linker = new Linker("","",undefined);
  public rewardToAddSelected: Reward = new Reward("","","",0);
  public newAbsoluteValueType: string = "";
  public newAbsoluteValue: any = "";


  // Flags
  public userIsAdmin: boolean = false;
  public userOwnsTheStrategy: boolean = false;
  public editDiagramFunctionsAvaliable: boolean = false;

  public isAddSubstrategyClicked: boolean = false;
  public isAddActivityClicked: boolean = false;
  public isAddAbsoluteValueClicked: boolean = false;
  public isAddLinkerClicked: boolean = false;
  public isAddRewardClicked: boolean = false;

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

    this.data = {nodes: this.nodes, edges: this.edges};

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
  }

  addSubstrategyToDiagram(): void {

    let newSubstrategy: SubStrategy = new SubStrategy(this.newSubstrategyName, new Array<node>(), new Array<edge>());

    this.localStrategy.substrategies.push(newSubstrategy);

    let newNode: node = new node(
      this.nodeIDCounter,
      this.newSubstrategyName,
      DEFAULT_SUBSTRATEGY_SHAPE,
      DEFAULT_SUBSTRATEGY_COLOR,
      DEFAULT_SUBSTRATEGY_TYPE,
      "",
      undefined
    );
    this.nodeIDCounter++;
        
    this.nodes.add(newNode);

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
  }

  addActivityToDiagram(): void {
    if(this.activityToAddSelected._id)
    {
      let newNode: node = new node(
        this.nodeIDCounter,
        this.activityToAddSelected.name.toString(),
        DEFAULT_ACTIVITY_SHAPE,
        DEFAULT_ACTIVITY_COLOR,
        DEFAULT_ACTIVITY_TYPE,
        this.activityToAddSelected._id.toString(),
        undefined
      );      

      this.nodes.add(newNode);
      this.addPropertiesFromTheActivityToDiagram(this.nodeIDCounter); // NO AÑADE EDGES CORRECTAMENTE, NO SE MUESTRAN
      // this.nodeIDCounter++; Is inside the method above
      // this.updateStrategy(); Is inside the method above

      this.isAddActivityClicked = false;
      this.activityToAddSelected = new Activity("","","");
    }
  }

  addPropertiesFromTheActivityToDiagram(activityNodeID: number): void {
    this.nodeIDCounter++;
    if(this.activityToAddSelected._id)
    {
      this._diagramDomainService.getPropertiesFromAnActivity(this.activityToAddSelected._id.toString()).subscribe((res: any) => {
        let properties: Array<Activity_Property> = res;
        let newNodes: Array<node> = [];
        let newEdges: Array<edge> = [];

        properties.forEach((p: Activity_Property) => {
          if(p._id)
          {
            let newNode: node = new node (
              this.nodeIDCounter,
              p.name.toString(),
              DEFAULT_PROPERTY_SHAPE,
              DEFAULT_PROPERTY_COLOR,
              DEFAULT_PROPERTY_TYPE,
              p._id.toString(),
              undefined
            );

            let newEdge: edge = new edge(
              activityNodeID+this.nodeIDCounter, //id
              activityNodeID, // from
              this.nodeIDCounter, //to
              "none", // arrows
              1, // value
              undefined
            )
            
            newNodes.push(newNode);
            newEdges.push(newEdge);
            
            this.nodeIDCounter++;
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
  }

  addLinkerToDiagram(): void {
    if(this.linkerToAddSelected._id)
    {
      let newNode: node = new node(
        this.nodeIDCounter,
        this.linkerToAddSelected.name,
        DEFAULT_LINKER_SHAPE,
        DEFAULT_LINKER_COLOR,
        DEFAULT_LINKER_TYPE,
        this.linkerToAddSelected._id,
        undefined
      );

      this.nodes.add(newNode);
      this.nodeIDCounter++;
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
  }

  addAbsoluteValueToDiagram(): void {
    let nodeLabel: string = "";
    switch (this.newAbsoluteValueType) {
      case 'T':
        nodeLabel = this.newAbsoluteValue;
        break;
      case 'N':
        nodeLabel = this.newAbsoluteValue.toString();
        break;
      case 'D':
        nodeLabel = "Date: "+this.newAbsoluteValue;
        break;
      default:
        console.log("Error selecting a tag for an absolute value node");
        break;
    }
    
    let newNode : node = new node(
      this.nodeIDCounter,
      nodeLabel,
      DEFAULT_ABSOLUTE_SHAPE,
      DEFAULT_ABSOLUTE_COLOR,
      DEFAULT_ABSOLUTE_TYPE,
      "",
      undefined
    );

    this.nodes.add(newNode);
    this.nodeIDCounter++;
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
  }

  addRewardToDiagram(): void {
    if(this.rewardToAddSelected._id)
    {
      let newNode: node = new node(
        this.nodeIDCounter,
        this.rewardToAddSelected.name.toString(),
        DEFAULT_REWARD_SHAPE,
        DEFAULT_REWARD_COLOR,
        DEFAULT_REWARD_TYPE,
        this.rewardToAddSelected._id.toString(),
        undefined
      );

      this.nodes.add(newNode);
      this.nodeIDCounter++;
      this.updateStrategy();
      this.isAddRewardClicked = false;
      this.rewardToAddSelected = new Reward("","","",0);
    }
  }

  

  updateStrategy(): void {
    /* NO UPDATEA */
    this._strategiesService.updateAStrategy(this.localStrategy);
    
  }

  debug():void {
    console.log(this.newAbsoluteValue)
  }

}
