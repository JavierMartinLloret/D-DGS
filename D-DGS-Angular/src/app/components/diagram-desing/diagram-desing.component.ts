import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from 'src/app/models/activity_property';
import { Context } from 'src/app/models/context';
import { Diagram } from 'src/app/models/diagram';
import { edge } from 'src/app/models/edge';
import { node } from 'src/app/models/node';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';
import { DataSet } from "vis-data";
import { Network } from 'vis-network';

const LOG_TOKEN: string = "LOG_TOKEN";
const PASSING_DIAGRAM: string = "PASSING_DIAGRAM_KEY";

const ACTIVITY_NODE_COLOR: string = "#C9FFE5";
const PROPERTY_NODE_COLOR: string = "#5D8AA8";


// INTERFACES
interface node_state {
  id: string, // NODE ID, nothing to do with an _id from DB
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
  public activitySelected: Activity = new Activity("","","");
  public wrapperSelectedNode: node = new node("","","","","","");
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

  private newNodeType: string = "ERROR";

  public nodeTypes: Array<string> = ["ACTIVITY", "PROPERTY", "REWARD", "LINKER"];

  // Flags
  public userIsAdmin: boolean = false;
  public isAddActivitiyClicked: boolean = false;
  public isAddRewardClicked: boolean = false;
  public isAddLinkerClicked: boolean = false;
  public isContextSelected: boolean = false;
  public isSaveDiagramClicked: boolean = false;

  public isANodeGrabbed: boolean = false;
  public isThereANodeOverDiagram: boolean = false;

  public isAnActivityWrapperClicked: boolean = false;
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

  constructor(private _diagramDomainService: DiagramDomainService, private _usersService: UsersService, private _router: Router) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux == null || aux == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    } 
    else {
      this.DOMAIN_KEY = aux;
      this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      })
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
    /* LOS DIAGRAMAS CARGADOS DE ESTA MANERA NO ESTÁN EN EL NODE TRIGGER! OJO */
    if(sessionStorage.getItem(PASSING_DIAGRAM)=="true")
    {
      this.newDiagram = this._diagramDomainService.loadDiagramToBeEdited();
      this.nodes.add(this.newDiagram.nodes);
      this.edges.add(this.newDiagram.edges);
      this.options = {
        manipulation: {
          enabled: false
        }
      };
      sessionStorage.removeItem(PASSING_DIAGRAM);
    }
    if (this.diagram != null) {
      this.network = new Network(this.diagram, this.data, this.options);
    }
    
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  addActivityClicked(): void{
    this.isAddActivitiyClicked = this.isAddActivitiyClicked ? false : true;
  }

  nodeGrabbed(nodeType: number): void {
    switch (nodeType) {
      case 0: // Activity
        {
          this.isANodeGrabbed = true;
          this.newNodeType = "ACTIVITY";
        }
        break;
      
      default:
        break;
    }
  }

  nodeOverDiagram(): void {
    this.isThereANodeOverDiagram = true;
  }

  nodeExitsTheDiagram(): void {
    
  }

  activityDropped(): void {
    let auxNode = new node(
      this.nodeIDCounter.toString(),
      "defaultName",
      "default",
      "defaultColor",
      "default",
      "defaultId"
    );

    let newTrigger: node_state = {
      id: "",
      type: "",
      value: false
    };
    
    if(this.isThereANodeOverDiagram)
    { 
      switch (this.newNodeType) {
        case "ACTIVITY":
          // Fill auxNode
          auxNode.label = "New Activity";
          auxNode.color = "#ffffff";
          auxNode.type  = "ACTIVITY_SELECTOR";

          // Fill newTrigger
          newTrigger = {
            id: auxNode.id,
            type: auxNode.type,
            value: false
          }
          break;
      
        default:
          break;
      }
      // Adding the node to the diagram
      this.nodes.add(auxNode);  

      // Adding the node to the "control" structures
      this.diagramNodes.push(auxNode);

      this.nodeTrigger.push(newTrigger);

      this.isThereANodeOverDiagram = false;
    }
    this.nodeIDCounter++;
    this.isANodeGrabbed = false;
  }

  diagramIsClicked() {
    if(this.nodeTrigger.length > 0)
    {
      let hasChanged: Array<node_state> = new Array<node_state>();
      /* Update the node triggers */
      this.nodeTrigger.forEach(node_state_struct => {
        if(node_state_struct.value != this.network.body.nodes[node_state_struct.id.toString()].selected)
        {
          node_state_struct.value = this.network.body.nodes[node_state_struct.id.toString()].selected;
          hasChanged.push(node_state_struct);
        }
      })
      switch (hasChanged.length) {
        case 0:
        {
            console.log("Sin cambios");
          
        }
          break;
        case 1:
        {
          console.log("Un cambio");
          switch (hasChanged[0].type) {
            case "ACTIVITY_SELECTOR":
            {
              this.isAnActivityWrapperClicked = true;
              // Hay que asignar a WrapperSelected el nodo que será sustituido.
              this.diagramNodes.forEach((n:node) => {
                if(n.id == hasChanged[0].id)
                  this.wrapperSelectedNode = n;
              })

            }              
              break;
          
            default:
              break;
          }        
        }
          break;
        case 2:   
        {
          console.log("Dos cambios");
        }
          break;
        default:
          break;
      }
    }
  }

  activityIsSelected(): void {
    // Hay que sustituir el nodo ACTIVITY_SELECTOR por el nodo/nodos que vayan a conformar la actividad this.activitySelected   
    /* Creamos el nuevo nodo que va a sustituir al anterior */
    if(this.activitySelected._id)
    {
      let newActivityNode: node = new node (
        this.wrapperSelectedNode.id,
        this.activitySelected.name.toString(),
        "default", //SHAPE
        "#189fdd", //COLOR,
        "ACTIVITY",
        this.activitySelected._id.toString()
      );
      /* Actualizar el Trigger */
      this.nodeTrigger.forEach((n_s:node_state) => {
        if(n_s.id == this.wrapperSelectedNode.id)
        {
          n_s.type = newActivityNode.type;
          n_s.value = false; // Will be false when added to the network
        }
      })
      /* Actualizar lista de nodos */
      this.diagramNodes.forEach((n:node) => {
        if(n.id == this.wrapperSelectedNode.id)
        {
          n.label = newActivityNode.label;
          n.shape = newActivityNode.shape;
          n.color = newActivityNode.color;
          n.type = newActivityNode. type;
          n.base_element_id = newActivityNode.base_element_id;
        }
      })
      /* Actualizar la red (Eliminar el nodo previo y luego añadir el nuevo) */
      this.nodes.remove(newActivityNode.id);
      this.nodes.add(newActivityNode);

      /* Resetear el sistema (Flags y variables locales) para poder repetir el proceso */
      this.isAnActivityWrapperClicked = false;
      this.wrapperSelectedNode = new node("","","","","","");
      this.contextSelected = new Context("","");
      this.activitySelected = new Activity("","","");

      /* Añadir las propiedades como nodos asociados a la actividad anterior */
      if(newActivityNode.base_element_id)
      this._diagramDomainService.getPropertiesFromAnActivity(newActivityNode.base_element_id.toString()).subscribe((res: any) => {
        this.addPropertyNodesToAnActivity(newActivityNode, res);});
    }
    
  }

  addPropertyNodesToAnActivity(activtyNode: node, properties: Array<Activity_Property>)
  {
    console.log(properties);
    
    if(activtyNode.base_element_id)
    {
      let nodesToAdd: Array<node> = new Array<node>();
      let auxNode: node = new node("","","","","", activtyNode.base_element_id,"");
      let edgesToAdd: Array<edge> = new Array<edge>();
      let auxEdge: edge = new edge("","","","",0,"");

      properties.forEach((property: Activity_Property) => {
        console.log("Añadiendo una propiedad con id: "+this.nodeIDCounter.toString());
        auxNode.id = this.nodeIDCounter.toString();
        auxNode.label = property.name.toString();
        auxNode.shape = "default"; // Shape
        auxNode.color = "#ad2677"; // Color
        auxNode.type = "PROPERTY";
        auxNode.base_element_id = activtyNode.base_element_id;
        
        
        auxEdge.id = activtyNode.id + "<->" + auxNode.id;
        auxEdge.from = activtyNode.id;
        auxEdge.to = auxNode.id;
        auxEdge.arrows = "default";
        auxEdge.value = 1;
        console.log("Añadiendo un enlace con id: "+auxEdge.id);

        if(auxNode.base_element_id)
        {
          nodesToAdd.push(new node(auxNode.id, auxNode.label, auxNode.shape, auxNode.color, auxNode.type, auxNode.base_element_id.toString()));
          edgesToAdd.push(new edge(auxEdge.id, auxEdge.from, auxEdge.to, auxEdge.arrows, auxEdge.value));
        }
        this.nodeIDCounter++;
      });
      
      console.log(nodesToAdd);
      
      this.nodes.add(nodesToAdd);
      this.edges.add(edgesToAdd);
    }
    /* Hay que crear un nodo por cada propiedad asociada a la actividad */
    /* Hay que crear un edge por cada propiedad. Los nodos tendrán sentido ACT -> PROPERTY */

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

  addActivityToTheDiagram_old(activity: Activity)
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

  addLinkerToTheDiagram_old()
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

  saveDiagram_old(): void
  {
    this.newDiagram.domain_key = this.DOMAIN_KEY;
    this.newDiagram.nodes = this.diagramNodes;
    this.newDiagram.edges = this.diagramEdges;
    this._diagramDomainService.postADiagram(this.newDiagram).subscribe((res: any) =>{
      window.alert("Diagram created! Keep modifing this one to make another!")
    })
    
  }
  

  debugmethod()
  {
    console.log(this.nodeIDCounter);
    console.log(this.userA_P);
    
    /*console.log("Nodes:");
    console.log(this.diagramNodes);
    console.log("Edges:");
    console.log(this.diagramEdges);*/

    
  }
}
