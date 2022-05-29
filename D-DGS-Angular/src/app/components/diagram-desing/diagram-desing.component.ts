import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from 'src/app/models/activity_property';
import { Context } from 'src/app/models/context';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { DataSet } from "vis-data";
import { Network } from 'vis-network';

const LOG_TOKEN: string = "LOG_TOKEN";
const ACTIVITY_NODE_COLOR: string = "#C9FFE5";
const PROPERTY_NODE_COLOR: string = "#5D8AA8";

// INTERFACES
interface node_state {
  id: string,
  value: boolean
};
interface node {
  id: string|undefined,
  label: string,
  shape: string,
  color: string
};
interface edge {
  from: string,
  to: string,
  value: number
}

const EQUALITY_LINKER = {
  id: 0,
  label: "=",
  shape: "square",
  color: "#C5000B"
};
const GREATER_THAN_LINKER = {
  id: 1,
  label: ">",
  shape: "square",
  color: "#C5000B"
};
const LESS_THAN_LINKER = {
  id: 2,
  label: "<",
  shape: "square",
  color: "#C5000B"
};



@Component({
  selector: 'app-diagram-desing',
  templateUrl: './diagram-desing.component.html',
  styleUrls: ['./diagram-desing.component.css']
})
export class DiagramDesingComponent implements OnInit {

  // Domain_Key
  public DOMAIN_KEY: string="";
  
  // Containers
  userContexts: any = [];
  userActivities: any = [];
  userA_P: Array<Activity_Property> = new Array<Activity_Property>();

  userRewardSets: any = [];
  userRewards: any = [];



  // Local variables
  public contextSelected: Context = new Context("","");
  public linkerSelected: any;
  
  public firstNodeSelected: boolean = false;

  private nodeIDCounter: number = 0;

  // Flags
  public isAddActivitiyClicked: boolean = false;
  public isAddRewardClicked: boolean = false;
  public isAddLinkerClicked: boolean = false;
  public isContextSelected: boolean = false;
  
  // Diagram-Related Variables
  public diagram: any;
  public nodes: any;
  public edges: any;
  public data: any;
  public options: any;
  public network: any;

  public nodeTrigger: Array<node_state> = new Array<node_state>();

  public LINKERS: Array<any> = [EQUALITY_LINKER, GREATER_THAN_LINKER, LESS_THAN_LINKER];

  constructor(private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if (aux) {
      this.DOMAIN_KEY = aux;
      this._diagramDomainService.getContextsFromAUser(this.DOMAIN_KEY).subscribe(res => {
        this.userContexts = res;
      })
      this._diagramDomainService.getAllRewardSetsFromACertainUser(this.DOMAIN_KEY).subscribe(res => {
        this.userRewardSets = res;
      })
    }
  }

  ngOnInit(): void {
    this.nodes = document.getElementById("nodesID");
    this.diagram = document.getElementById("diagramID");

    this.nodes = new DataSet();
    this.edges = new DataSet();
    this.data = {
      nodes: this.nodes,
      edges: this.edges
    };
    this.options = {};
    if (this.diagram != null) {
      this.network = new Network(this.diagram, this.data, this.options);
    }
  }

  addActivityClicked(): void{
    this.isAddActivitiyClicked = this.isAddActivitiyClicked ? false : true;
  }

  addRewardClicked(): void{
    
  }

  /* JUST FOR TEST */
  addLinkerClicked(): void{
    this.isAddLinkerClicked = this.isAddLinkerClicked ? false: true;
  }

  contextIsSelected(): void {
    if(this.contextSelected._id != undefined)
    {
      this._diagramDomainService.getActivitiesFromAContext(this.contextSelected._id.toString()).subscribe((activities:any) => {
        this.userActivities = activities;
        this.isContextSelected = true;

        this._diagramDomainService.getAllProperties().subscribe((properties: any) => {
          properties.forEach((property: Activity_Property) => {
            this.userA_P.push(property);
          });
        })
      })
    }
  }

  addActivityToTheDiagram(activity: Activity)
  {
    try {
      let nodesToAdd: Array<node> = new Array<node>();
      let auxNode : node;
      let activtyNodeID: number = 0;

      let edgesToAdd: Array<edge> = new Array<edge>();
      let auxEdge: edge;

      /* Crear el nodo principal (Actividad) y nodos hijos (Propiedades) */
      auxNode = {
        id: this.nodeIDCounter.toString(),
        label: activity.name.toString(),
        shape: "Default",
        color: ACTIVITY_NODE_COLOR
      };
      activtyNodeID = this.nodeIDCounter;
      this.nodeIDCounter++;
      nodesToAdd.push(auxNode);

      this.userA_P.forEach((property: Activity_Property) => {      
        
        if(activity._id != undefined)
        {
          if(property.activity_ID == activity._id.toString())
          {          
            auxNode = {
              id: this.nodeIDCounter.toString(),
              label: property.name.toString(),
              shape: "Default",
              color: PROPERTY_NODE_COLOR
            };
            auxEdge = {
              from: activtyNodeID.toString(),
              to: this.nodeIDCounter.toString(),
              value: 3
            };
            
            this.nodeIDCounter++;
            nodesToAdd.push(auxNode);
            edgesToAdd.push(auxEdge);
          }
        }
      });

      this.nodes.add(nodesToAdd);
      this.edges.add(edgesToAdd);

      // Preparing the trigger sistem
      let newTrigger: node_state;
      nodesToAdd.forEach((node: node) => {
        if(node.id != undefined)
        {
          newTrigger = {
            id: node.id,
            value: false
          }
          this.nodeTrigger.push(newTrigger);
        }
      });
      /*
      if(activity._id != undefined)
      {
        let newTrigger: node_state = 
        {
          id: activity._id.toString(),
          value: false
        }
        this.nodeTrigger.push(newTrigger);
      }*/
        
    } catch (error) {
      console.log("Error! Nodo repetido!");
    }
  }

  addLinkerToTheDiagram()
  {
    console.log(this.linkerSelected);
    
    this.nodes.add(this.linkerSelected);
    let newTrigger: any =
    {
      id: this.linkerSelected.id,
      value: false
    }
    this.nodeTrigger.push(newTrigger);
  }

  diagramIsClicked()
  {
    if(this.nodeTrigger.length != 0)
    {
      let hasChanged: Array<node_state> = new Array<node_state>();
      /* Update the node triggers */
      this.nodeTrigger.forEach(dupla => {
        if(dupla.value != this.network.body.nodes[dupla.id.toString()].selected)
        {
          dupla.value = this.network.body.nodes[dupla.id.toString()].selected;
          hasChanged.push(dupla);
        }

      });

      hasChanged.forEach(dupla => {
        if(dupla.value == true)
          console.log("Node with ID:"+dupla.id+" selected!");
        else
          console.log("Node with ID:"+dupla.id+" unselected!");
      })
    }
  }

  debugmethod()
  {
    console.log(this.nodeTrigger);
    
  }
}
