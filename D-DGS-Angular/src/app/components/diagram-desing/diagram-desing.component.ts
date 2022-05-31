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
  type: string,
  value: boolean
};
interface node {
  id: string|undefined,
  label: string,
  type: string
  shape: string,
  color: string
};
interface edge {
  id: string,
  from: string,
  to: string,
  value: number,
  arrows: string
}



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
  private nodeIDCounter: number = 0;
  private newEdge: edge = {
    id: "",
    from: "",
    to: "",
    arrows: "",
    value: 1
  };

  // Flags
  public isAddActivitiyClicked: boolean = false;
  public isAddRewardClicked: boolean = false;
  public isAddLinkerClicked: boolean = false;
  public isContextSelected: boolean = false;

  public isLinkModeActivated: boolean = false; // Linker is selected

  // Diagram-Related Variables
  public diagram: any;
  public nodes: any;
  public edges: any;
  public data: any;
  public options: any;
  public network: any;

  public nodeTrigger: Array<node_state> = new Array<node_state>();
  public edgesIdsRegister: Set<string> = new Set<string>();

  public EQUALITY_LINKER: node = {
    id: "-1",
    label: "=",
    type: "Linker",
   shape: "square",
   color: "#C5000B"
  };
  public LESS_THAN_LINKER: node = {
    id: "-2",
    label: "<",
    type: "Linker",
   shape: "square",
   color: "#C5000B"
  };
  public GREATER_THAN_LINKER: node = {
    id: "-3",
    label: ">",
    type: "Linker",
   shape: "square",
   color: "#C5000B"
  };

  public LINKERS: Array<node> = [this.EQUALITY_LINKER, this.GREATER_THAN_LINKER, this.LESS_THAN_LINKER];

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
        type: "Default",
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
              type: "Default",
              shape: "Default",
              color: PROPERTY_NODE_COLOR
            };
            auxEdge = {
              id: this.nodeIDCounter.toString()+"-"+activtyNodeID.toString(),
              from: activtyNodeID.toString(),
              to: this.nodeIDCounter.toString(),
              value: 3,
              arrows: "from"
            };
            
            this.nodeIDCounter++;
            nodesToAdd.push(auxNode);
            edgesToAdd.push(auxEdge);
          }
        }
      });

      this.nodes.add(nodesToAdd);
      this.edges.add(edgesToAdd);

      edgesToAdd.forEach(edge => {
        this.edgesIdsRegister.add(edge.id);
      });

      // Preparing the trigger sistem
      let newTrigger: node_state;
      nodesToAdd.forEach((node: node) => {
        if(node.id != undefined)
        {
          newTrigger = {
            id: node.id,
            type: "Default",
            value: false
          }
          this.nodeTrigger.push(newTrigger);
        }
      });
        
    } catch (error) {
      console.log("Error! Nodo repetido!");
    }
  }

  addLinkerToTheDiagram()
  {
    console.log(this.linkerSelected);
    
    this.nodes.add(this.linkerSelected);
    let newTrigger: node_state =
    {
      id: this.linkerSelected.id,
      type: "Linker",
      value: false
    }
    this.nodeTrigger.push(newTrigger);
  }

  diagramIsClicked()
  {
    if(this.nodeTrigger.length != 0) // Siempre y cuando haya elementos en el diagrama
    {
      let hasChanged: Array<node_state> = new Array<node_state>();
      /* Update the node triggers */
      this.nodeTrigger.forEach(node_state_struct => {
        if(node_state_struct.value != this.network.body.nodes[node_state_struct.id.toString()].selected)
        {
          node_state_struct.value = this.network.body.nodes[node_state_struct.id.toString()].selected;
          hasChanged.push(node_state_struct);
        }

      });

      switch (hasChanged.length) {
        case 0:
          {
            console.log("Sin cambios en el diagrama");
          }
          break;
        case 1:
          {
            if(hasChanged[0].type == "Linker")
            {
              if(hasChanged[0].value)
              {
                console.log("Link mode activated");
                this.isLinkModeActivated = true;
              }
              else
              {
                console.log("Link mode disabled");
                this.isLinkModeActivated = false;
              }              
            }
            else
            {
              // Display node characteristics ???
            }
          }
          break;
        case 2:
          {
            console.log("2 cambios en el diagrama");
            let auxNode1: node_state = {
              id: "",
              type: "",
              value: false
            }
            let auxNode2: node_state = auxNode1;
            auxNode1 = hasChanged[0];
            auxNode2 = hasChanged[1];

            if((this.isLinkModeActivated && auxNode1.type == "Linker") || (this.isLinkModeActivated && auxNode2.type == "Linker"))
            {
              if(this.isLinkModeActivated && auxNode1.type == "Linker")
              {
                this.newEdge.from = auxNode1.id;
                this.newEdge.to = auxNode2.id;
              }
              if(this.isLinkModeActivated && auxNode2.type == "Linker")
              {
                this.newEdge.to = auxNode1.id;
                this.newEdge.from = auxNode2.id;
              }
              /* IS IT POSSIBLE TO LINK THE NODE ? HERE SHOULD BE THE LINKEABILITY EVALUATED */
              this.newEdge.id = auxNode1.id +"-"+ auxNode2.id;
              if(this.edgesIdsRegister.has(this.newEdge.id))
              {
                this.edges.remove(this.newEdge.id);
                this.edgesIdsRegister.delete(this.newEdge.id)
              }
              else
              {
                this.edges.add(this.newEdge);
                this.edgesIdsRegister.add(this.newEdge.id);
              }


              this.newEdge.id = this.newEdge.from = this.newEdge.to = "";
              this.isLinkModeActivated = false;
            }
          }
        break;
      
        default:
          console.log("Mal rollo");
          
          break;
      }

    }
  }

  debugmethod()
  {
    //console.log(this.network.body.edges);
    console.log(this.edgesIdsRegister);
    
  }
}
