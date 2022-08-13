import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from 'src/app/models/activity';
import { Context } from 'src/app/models/context';
import { Reward_Set } from 'src/app/models/reward_set';
import { User } from 'src/app/models/user';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.css']
})
export class ListOfUsersComponent implements OnInit {

  // Domain_Key
  public DOMAIN_KEY: string="";

  // Containers
  public users: User[] = [];

  // Local variables
  public userToEdit = new User("","","","",false);

  // Flags
  public userIsAdmin: boolean = false;
  public isEditUserClicked: boolean = false;

  // Table needs
  public tableHeader: string[] = ['DatabaseID', 'Name', 'Email', 'IsAdmin', 'Actions'];

  constructor(private _router: Router, private _userService: UsersService, private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._userService.getUsers().subscribe((users:any) => {
        this.users = users;
      })
      this._userService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
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
    if(aux) // No es administrador
    {
      this.DOMAIN_KEY = aux;
    }
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }

  debug(){console.log(this.userToEdit)}

  editUserIsClicked(u: User)
  {
    this.userToEdit = u;
    this.isEditUserClicked = this.isEditUserClicked ? false: true;
  }

  editUser()
  {
    this._userService.updateUser(this.userToEdit).subscribe(res => {window.location.reload();});    
  }

  deleteUser(u: User)
  {
    /*
      REWARD_SET
        REWARDS

      CONTEXT
        ACTIVITIES
          PROPERTIES

      STRATEGIES
    */
    console.log("BEFORE DELETE");
    
    if(confirm("Are you sure you want to delete this user? It will also delete al info related to it."))
    {
      console.log("Inside DELETE");
      this._diagramDomainService.getAllRewardSetsFromACertainUser(u.domain_key).subscribe((sets: any) => {
        console.log(sets);        
        sets.forEach((r_s: Reward_Set) => {
          if(r_s._id)
          {
            this._diagramDomainService.deleteAllRewardsFromACertainSet(r_s._id.toString()).subscribe(res => {window.location.reload();});
            this._diagramDomainService.deleteARewardSet(r_s._id.toString()).subscribe(res => {window.location.reload();});
          }
        })
      });
      this._diagramDomainService.getContextsFromAUser(u.domain_key).subscribe((contexts: any) => {
        console.log(contexts); 
        contexts.forEach((c: Context) => {
          if(c._id)
          {
            this._diagramDomainService.getActivitiesFromAContext(c._id.toString()).subscribe((activities: any) => {
              console.log(activities); 
              activities.forEach((a: Activity) => {
                if(a._id)
                {
                  this._diagramDomainService.deleteAllPropertiesFromAnActivity(a._id.toString()).subscribe(res => {window.location.reload();});
                  this._diagramDomainService.deleteAnActivity(a._id.toString()).subscribe(res => {window.location.reload();});
                }
              });
            });
            this._diagramDomainService.deleteAContext(c._id.toString()).subscribe(res => {window.location.reload();})
          }
        })
      });
      // DELETE STRATEGIES
      if(u._id)
        this._userService.deleteUser(u._id.toString()).subscribe(res => {window.location.reload();})
    }
    console.log("AFTER DELETE");
  }
}
