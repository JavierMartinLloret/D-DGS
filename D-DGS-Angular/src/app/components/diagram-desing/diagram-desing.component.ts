import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from 'src/app/models/activity_property';
import { Context } from 'src/app/models/context';
import { Diagram } from 'src/app/models/diagram';
import { edge } from 'src/app/models/edge';
import { node } from 'src/app/models/node';
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
  public linkerSelected: node = new node("","","","","","",undefined);
  private nodeIDCounter: number = 0;
  private newEdge: edge = {
    _id: undefined,
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
  public isSaveDiagramClicked: boolean = false;

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
  public diagramNodes: Array<node> = new Array<node>();
  public diagramEdges: Array<edge> = new Array<edge>();
  public newDiagram: Diagram = new Diagram("", "", this.diagramNodes, this.diagramEdges, undefined);

  public EQUALITY_LINKER: node = {
    _id: undefined,
    id: "-1",
    label: "=",
    type: "Linker",
    shape: "square",
    color: "#C5000B",
    base_element_id: "Ole ole los caracole"
  };
  public LESS_THAN_LINKER: node = {
    _id: undefined,
    id: "-2",
    label: "<",
    type: "Linker",
    shape: "square",
    color: "#C5000B",
    base_element_id: "Ole ole los caracole"
  };
  public GREATER_THAN_LINKER: node = {
    _id: undefined,
    id: "-3",
    label: ">",
    type: "Linker",
    shape: "square",
    color: "#C5000B",
    base_element_id: "Ole ole los caracole"
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

  saveDiagramClicked(): void{
    this.isSaveDiagramClicked = this.isSaveDiagramClicked ? false: true;
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
      if(activity._id != undefined)
      {
        auxNode = new node(
        this.nodeIDCounter.toString(),
        activity.name.toString(),
        "Default",
        ACTIVITY_NODE_COLOR,
        "Default",
        activity._id?.toString(),
        undefined
        );
        activtyNodeID = this.nodeIDCounter;
        this.nodeIDCounter++;
        nodesToAdd.push(auxNode);
      }

      this.userA_P.forEach((property: Activity_Property) => {      
        
        if(activity._id != undefined)
        {
          if(property.activity_ID == activity._id.toString())
          {          
            auxNode = new node (
              this.nodeIDCounter.toString(),
              property.name.toString(),
              "Default",
              PROPERTY_NODE_COLOR,
              "Default",
              activity._id?.toString(),
              undefined
            );
            auxEdge = new edge(
              this.nodeIDCounter.toString()+"-"+activtyNodeID.toString(),
              activtyNodeID.toString(),
              this.nodeIDCounter.toString(),
              "from",
              3,
              undefined
            );
            
            this.nodeIDCounter++;
            nodesToAdd.push(auxNode);
            edgesToAdd.push(auxEdge);
          }
        }
      });

      nodesToAdd.forEach(nodeToAdd => {this.diagramNodes.push(nodeToAdd);})
      edgesToAdd.forEach(edgeToAdd => {this.diagramEdges.push(edgeToAdd);})
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
    let auxNode : node = new node(this.linkerSelected.id, this.linkerSelected.label, this.linkerSelected.shape, this.linkerSelected.color, this.linkerSelected.type, "THERE IS NO SUCH ELEMENT NOW", undefined);
    this.nodes.add(auxNode);
    this.diagramNodes.push(auxNode);

    let newTrigger: node_state =
    {
      id: this.linkerSelected.id,
      type: "Linker",
      value: false
    }
    this.nodeTrigger.push(newTrigger);
  }

  saveDiagram(): void
  {
    this.newDiagram.domain_key = this.DOMAIN_KEY;
    this.newDiagram.nodes = this.diagramNodes;
    this.newDiagram.edges = this.diagramEdges;
    console.log(this.newDiagram);
    
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
                
                let aux: Array<edge> = new Array<edge>();
                this.diagramEdges.forEach((e: edge) => {
                  if(e.id != this.newEdge.id)
                    aux.push(e);
                })
                this.diagramEdges = aux;
              }
              else
              {
                let auxedge : edge = new edge(this.newEdge.id, this.newEdge.from, this.newEdge.to, "", 1, undefined);
                /*
                console.log(this.newEdge);
                this.diagramEdges.push(this.newEdge);*/
                this.diagramEdges.push(auxedge);
                this.edgesIdsRegister.add(this.newEdge.id);
                this.edges.add(this.newEdge);
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
    console.log("Nodes:");
    console.log(this.diagramNodes);
    console.log("Edges:");
    console.log(this.diagramEdges);

    
  }
}
