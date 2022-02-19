import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  public users: any = [];

  constructor(private _userService: UsersService,
    private _router: Router) {
      this._userService.getUsers().subscribe(users => {
        this.users = users;
      })
    }

  ngOnInit(): void {
    if(sessionStorage.getItem(LOG_TOKEN) == null || sessionStorage.getItem(LOG_TOKEN) == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }

  deleteUserFromMenu(iDFromUserToDelete: number){
    this._userService.deleteUser(iDFromUserToDelete).subscribe(newUser => {
      if(newUser)
        window.location.reload();
    })
  }

}
