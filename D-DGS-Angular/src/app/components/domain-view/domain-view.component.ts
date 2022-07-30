import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Context } from 'src/app/models/context';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario

@Component({
  selector: 'app-domain-view',
  templateUrl: './domain-view.component.html',
  styleUrls: ['./domain-view.component.css']
})
export class DomainViewComponent implements OnInit {

  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  public userContexts: any = [];
  public contextActivities: any = [];

  // Local variables
  public currentContext: Context = new Context("","",undefined);

  // Table needs
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Actions'];

  // Flags
  public userIsAdmin: boolean = false;
  public thisUserOwnsTheContext: boolean = false;

  constructor(private _diagramDomainService: DiagramDomainService, private _usersService:UsersService, private _router: Router) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._diagramDomainService.getContextsFromAUser(this.DOMAIN_KEY).subscribe((a: any) => {
        this.userContexts = a;

        // User has ownership of this domain
        let currentContextID = this._router.url.split('/').pop(); // God bless Stack Overflow
        a.forEach((c: Context) => {
          if(c._id)
            if(c._id.toString() == currentContextID)
            {
              this.thisUserOwnsTheContext = true;
              
              this.currentContext._id = c._id;
              this.currentContext.domain_key = c.domain_key;
              this.currentContext.name = c.name;
            }
        });
        
        if(!this.thisUserOwnsTheContext)
          this._router.navigateByUrl('/main');

        if(this.currentContext._id)
          this._diagramDomainService.getActivitiesFromAContext(this.currentContext._id.toString()).subscribe(res => {this.contextActivities = res;})
      });

      this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      });
    }
  }

  ngOnInit(): void {
    if(this.DOMAIN_KEY == null || this.DOMAIN_KEY == 'FAILED')
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

}
