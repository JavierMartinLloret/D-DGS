import { Component, OnInit } from '@angular/core';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";

@Component({
  selector: 'app-test-diagram',
  templateUrl: './test-diagram.component.html',
  styleUrls: ['./test-diagram.component.css']
})
export class TestDiagramComponent implements OnInit {

  
  public DOMAIN_KEY: string ="";
  public userIsAdmin: boolean = true;
  public userContexts: any = [];

  public tableHeader: string[] = ['DatabaseID', 'Name', 'Actions'];

  constructor(private _diagramDomainService: DiagramDomainService, private _usersService: UsersService) {
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
    
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  debug()
  {
    this.userIsAdmin = this.userIsAdmin ? false: true;
  }
}
