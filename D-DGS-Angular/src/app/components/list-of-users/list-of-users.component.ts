import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.scss']
})
export class ListOfUsersComponent implements OnInit {

  public users: any = [];

  constructor(private _userService: UsersService,
    private _router: Router) { }

  ngOnInit(): void {
    this._userService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  deleteUserFromMenu(iDFromUserToDelete: number){
    this._userService.deleteUser(iDFromUserToDelete).subscribe(newUser => {
      if(newUser)
        window.location.reload();
    })
  }

}
