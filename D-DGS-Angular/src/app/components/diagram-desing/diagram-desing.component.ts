import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from 'src/app/models/activity_property';
import { Context } from 'src/app/models/context';
import { Diagram } from 'src/app/models/diagram';
import { edge } from 'src/app/models/edge';
import { Linker } from 'src/app/models/linker';
import { node } from 'src/app/models/node';
import { Reward } from 'src/app/models/reward';
import { Reward_Set } from 'src/app/models/reward_set';
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
  public userContexts: any = [];
  public userActivities: any = [];
  public userRewardSets: any = [];
  public userRewards: any = [];
  public linkers: any = [];
  public linkerCategories: Set<string> = new Set<string>();
  public linkersInTheCategorySelected: Array<Linker> = new Array<Linker>();  

  // Local variables
  public contextSelected: Context = new Context("","");
  public rewardSetSelected: Reward_Set = new Reward_Set("","");
  public activitySelected: Activity = new Activity("","","");
  public rewardSelected: Reward = new Reward("","","",0);
  public linkerCategorySelected: string = "";
  public linkerSelected: Linker = new Linker("","",);
  public wrapperSelectedNode: node = new node("","","","","","");
  private nodeIDCounter: number = 0;

  private newNodeType: string = "ERROR";

  public nodeTypes: Array<string> = ["ACTIVITY", "PROPERTY", "REWARD", "LINKER"];

  // Flags
  public userIsAdmin: boolean = false;
  public isAddActivitiyClicked: boolean = false;
  public isAddRewardClicked: boolean = false;
  public isAddLinkerClicked: boolean = false;
  public isContextSelected: boolean = false;
  public isRewarSetSelected: boolean = false;
  public isLinkerCategorySelected: boolean = false;
  public isSaveDiagramClicked: boolean = false;

  public isAWrapperGrabbed: boolean = false;
  public isThereANodeOverDiagram: boolean = false;

  public isAnLinkerWrapperClicked: boolean = false;
  public isAnActivityWrapperClicked: boolean = false;
  public isAnRewardWrapperClicked: boolean = false;
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
      this._diagramDomainService.getAllLinkers().subscribe((res:any) => {
        this.linkers = res;
        res.forEach((l:Linker) => {
          this.linkerCategories.add(l.category);
        });
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
        this.isAWrapperGrabbed = true;
        this.newNodeType = "ACTIVITY";
      }break;
      
      case 1: // Reward
      {
        this.isAWrapperGrabbed = true;
        this.newNodeType = "REWARD";
      }break;
      
      case 2:
      {
        this.isAWrapperGrabbed = true;
        this.newNodeType = "LINKER";
      }break;

      default:
        break;
    }
  }

  nodeOverDiagram(): void {
    this.isThereANodeOverDiagram = true;
  }

  nodeExitsTheDiagram(): void {
    
  }

  wrapperDropped(): void {
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
        {
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
        }break;

        case "REWARD":
        {
          auxNode.label = "New Reward";
          auxNode.color = "#d8d502";
          auxNode.type = "REWARD_SELECTOR";
          auxNode.shape = "star";

          newTrigger.id = auxNode.id;
          newTrigger.type = auxNode.type;
          newTrigger.value = false;
        }break;

        case "LINKER":
        {
          auxNode.label = "New Linker";
          auxNode.color = "#46fc0f";
          auxNode.type = "LINKER_SELECTOR";
          auxNode.shape = "diamond";

          newTrigger.id = auxNode.id;
          newTrigger.type = auxNode.type;
          newTrigger.value = false;
        }break;
      
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
    this.isAWrapperGrabbed = false;
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
          this.wrapperSelectedNode = new node("","","","","","");
        }break;
         
        case 1:
        {
          console.log("Un cambio");
          if(hasChanged[0].value)
          {
            switch (hasChanged[0].type) {
            case "ACTIVITY_SELECTOR":
            {
              this.isAnActivityWrapperClicked = true;
              // Hay que asignar a WrapperSelected el nodo que será sustituido.
              this.diagramNodes.forEach((n:node) => {
                if(n.id == hasChanged[0].id)
                  this.wrapperSelectedNode = n;
              })

            }break;              
            
            case "REWARD_SELECTOR":
            {
              this.isAnRewardWrapperClicked = true;
              this.diagramNodes.forEach((n:node)=> {
                if(n.id == hasChanged[0].id)
                  this.wrapperSelectedNode = n;
              })
            }break;

            case "LINKER_SELECTOR":
            {
              this.isAnLinkerWrapperClicked = true;
              this.diagramNodes.forEach((n:node)=> {
                if(n.id == hasChanged[0].id)
                  this.wrapperSelectedNode = n;
              })
            }break;
          
            default:break;
            }
          }
          else
          {
            this.wrapperSelectedNode = new node("","","","","","");
            this.isAnActivityWrapperClicked = this.isAnRewardWrapperClicked
             = this.isAnLinkerWrapperClicked = false;
          }         
      }break;
        
      case 2:   // EL QUE TENGA EL value: true ES EL SEGUNDO EN SER PULSADO
      {
        console.log("Dos cambios");
      }break;
          
      default:break;
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
  // @see activityIsSelected()
  rewardIsSelected(): void {
    if(this.rewardSelected._id)
    {
      let newRewardNode: node = new node(
        this.wrapperSelectedNode.id,
        this.rewardSelected.name.toString(),
        "star",
        "#d87102",
        "REWARD",
        this.rewardSelected._id.toString()
      );

      this.nodeTrigger.forEach((n_s:node_state) => {
        if(n_s.id == this.wrapperSelectedNode.id)
        {
          n_s.type = newRewardNode.type;
          n_s.value = false; // Will be false when added to the network
        }
      });

      this.diagramNodes.forEach((n:node) => {
        if(n.id == this.wrapperSelectedNode.id)
        {
          n.label = newRewardNode.label;
          n.shape = newRewardNode.shape;
          n.color = newRewardNode.color;
          n.type = newRewardNode. type;
          n.base_element_id = newRewardNode.base_element_id;
        }
      });
      
      this.nodes.remove(newRewardNode.id);
      this.nodes.add(newRewardNode);

      /* Resetear el sistema (Flags y variables locales) para poder repetir el proceso */
      this.isAnRewardWrapperClicked = false;
      this.wrapperSelectedNode = new node("","","","","","");
      this.rewardSetSelected = new Reward_Set("","");
      this.rewardSelected = new Reward("","","",0);
    }
  }
  
  linkerIsSelected(): void {
    this.isAnLinkerWrapperClicked = false;
    if(this.linkerSelected._id)
    {
      let newLinkerNode: node = new node (
        this.wrapperSelectedNode.id,
        this.linkerSelected.name.toString(),
        "diamond", //SHAPE
        "#46fc0f", //COLOR,
        "LINKER",
        this.linkerSelected._id.toString()
      );

      this.nodeTrigger.forEach((n_s:node_state) => {
        if(n_s.id == this.wrapperSelectedNode.id)
        {
          n_s.type = newLinkerNode.type;
          n_s.value = false; // Will be false when added to the network
        }
      });

      this.diagramNodes.forEach((n:node) => {
        if(n.id == this.wrapperSelectedNode.id)
        {
          n.label = newLinkerNode.label;
          n.shape = newLinkerNode.shape;
          n.color = newLinkerNode.color;
          n.type = newLinkerNode. type;
          n.base_element_id = newLinkerNode.base_element_id;
        }
      })

      this.nodes.remove(newLinkerNode.id);
      this.nodes.add(newLinkerNode);

      this.isAnActivityWrapperClicked = false;
      this.wrapperSelectedNode = new node("","","","","","");
      this.linkerCategorySelected = "";
      this.linkerSelected = new Linker("","");
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
      
      nodesToAdd.forEach((n:node) => {
        this.diagramNodes.push(n);
        let n_s : node_state = {id: n.id, type: n.type, value: false};
        this.nodeTrigger.push(n_s);
      })
      
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
      })
    }
  }

  rewardSetIsSelected(): void {
    if(this.rewardSetSelected._id != undefined)
    {
      this._diagramDomainService.getRewardsOfACertainSet(this.rewardSetSelected._id.toString()).subscribe((rewards: any) => {
        this.userRewards = rewards;
        this.isRewarSetSelected = true;
      })
    }
  }

  linkerCategoryIsSelected()
  {
    this._diagramDomainService.getLinkersFromAnSpecificCategory(this.linkerCategorySelected).subscribe((res:any) => {this.linkersInTheCategorySelected = res});
    this.isLinkerCategorySelected = true;
  }

  debugmethod()
  {
    console.log(this.linkers);
    console.log(this.linkerCategories);
    
    /*console.log(this.nodeIDCounter);
    console.log(this.diagramNodes);
    console.log(this.nodeTrigger);
    console.log("Nodes:");
    console.log(this.diagramNodes);
    console.log("Edges:");
    console.log(this.diagramEdges);*/

    
  }
}
