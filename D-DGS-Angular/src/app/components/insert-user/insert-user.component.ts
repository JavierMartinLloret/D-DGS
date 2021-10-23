import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-insert-user',
  templateUrl: './insert-user.component.html',
  styleUrls: ['./insert-user.component.scss']
})
export class InsertUserComponent implements OnInit {

  public newUser: User = new User();

  constructor(private _usersService: UsersService,
              private _router: Router) { }

  ngOnInit(): void {
  }

  insertUserInDB() {
    /* Completamos campos no inicializados */


    console.log("The user which will bew inserted into db is", this.newUser)
    this._usersService.postUser(this.newUser).subscribe(user => {
      if(user) {
        this._router.navigateByUrl('/users');
      }
    })
  }

}
