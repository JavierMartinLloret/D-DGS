import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Activity } from 'src/app/models/activity';
import { Activity_Property } from "src/app/models/activity_property";
import { Context } from 'src/app/models/context';
import { DiagramDomainService } from "src/app/services/diagramDomain.service";
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario

@Component({
  selector: 'app-diagram-creation',
  templateUrl: './diagram-creation.component.html',
  styleUrls: ['./diagram-creation.component.css']
})
export class DiagramCreationComponent implements OnInit {
  
  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  public userContexts: any = [];

  // Local variables
  public newContextName: String = "";
  public contextToEdit: Context = new Context("","", undefined);

  // Flags
  public userIsAdmin: boolean = false;
  public isAddNewContextClicked = false;
  public isEditContextClicked = false;

  // Table needs
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Actions'];

  constructor(private _diagramDomainService: DiagramDomainService,private _usersService: UsersService, private _router: Router) { 
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;

      this._diagramDomainService.getContextsFromAUser(this.DOMAIN_KEY).subscribe(a => {this.userContexts = a;})
      this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      })
    }
  }

  ngOnInit(): void {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux == null || aux == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  createNewContextClicked()
  {
    this.isAddNewContextClicked = this.isAddNewContextClicked ? false: true;
  }

  createNewContext()
  {
    let newContext = new Context(this.newContextName, this.DOMAIN_KEY);
    this._diagramDomainService.postANewContext(newContext).subscribe(res => {window.location.reload();});
  }

  navigateToContext(context: Context)
  {
    if(context._id)
      this._router.navigateByUrl('/domain_craft_area/domains/'+context._id.toString());
  }

  editContextClicked(c : Context)
  {
    this.contextToEdit = c;
    this.isEditContextClicked = this.isEditContextClicked ? false : true;
  }

  editContext()
  {
    /* REQUIERE DE TESTEO CON POSTMAN EN LA TORRE */
    this._diagramDomainService.updateAContext(this.contextToEdit).subscribe(res => {window.location.reload();})
  }

  deleteContext(contextClicked: Context)
  {
    if(confirm("Are you sure you want to delete this domain? This is irreversible"))
      if(contextClicked._id)  
        this._diagramDomainService.deleteAContext(contextClicked._id.toString()).subscribe(res => {window.location.reload();})
    /* HAY QUE ELIMINAR EN CASCADA LAS ACTIVIDADES ASOCIADAS */
  } 

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  debugmethod()
  {
    console.log(this.userContexts);
  }
}
