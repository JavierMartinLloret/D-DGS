import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public users: any = [];

  // Local variables
  public userToEdit = new User("","","","",false);
  public newEditedUser = new User("","","","",false);

  // Flags
  public isEditUserSelected: boolean = false;

  constructor(private _router: Router, private _userService: UsersService, private _diagramDomainService: DiagramDomainService) {
      this._userService.getUsers().subscribe(users => {
        this.users = users;
      })
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
      this._userService.isThisUserAnAdministrator(aux).subscribe((response: any) => {
        if(!response)
        this._router.navigateByUrl('/main');
      })
    }
  }

  editUserIsSelected(user: User)
  {
    this.userToEdit = user;
    this.isEditUserSelected = this.isEditUserSelected ? false : true;    
  }

  editUser()
  {
    this.newEditedUser.domain_key = this.userToEdit.domain_key;
    this.newEditedUser._id = this.userToEdit._id;
    this._userService.updateUser(this.newEditedUser).subscribe(res => {window.location.reload();});
  }

  deleteUser(user: User)
  {
    this._diagramDomainService.deleteAllContextsFromAUser(this.DOMAIN_KEY).subscribe(res => {
      this._diagramDomainService.deleteAllRewardSetsFromASpecificUser(this.DOMAIN_KEY).subscribe(res => {
        if(user._id != undefined)
          this._userService.deleteUser(user._id).subscribe(res => {window.location.reload();});
      })
    });    
  }

  debugmethod()
  {
    console.log(this.userToEdit);
    
  }
  debugmethod2()
  {
    console.log(this.newEditedUser);
    
  }

}
