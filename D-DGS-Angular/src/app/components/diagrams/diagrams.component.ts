import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diagram } from 'src/app/models/diagram';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { FileRelatedService } from 'src/app/services/file-related.service';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
const PASSING_DIAGRAM: string = "PASSING_DIAGRAM_KEY";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.css']
})
export class DiagramsComponent implements OnInit {

  
  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  //public strategies: Strategy[] = [];

  // Local variables
  //public newStrategy: Strategy = new Strategy();

  // Table needs
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Description', 'Domain', 'Reward Set', 'Actions'];

  // Flags
  public userHasDiagrams: boolean = false;
  public userIsAdmin: boolean = false;
  

  constructor(private _router: Router, private _diagramDomainService: DiagramDomainService, private _usersService: UsersService, private _downloadService: FileRelatedService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      })
    }
    
  }

  ngOnInit(): void {}

  unlogUser(): void {sessionStorage.removeItem(LOG_TOKEN);}

  debug():void {this.userHasDiagrams = this.userHasDiagrams ? false : true;}

  // CLICKED

  createANewStrategy()
  {

  }

}
