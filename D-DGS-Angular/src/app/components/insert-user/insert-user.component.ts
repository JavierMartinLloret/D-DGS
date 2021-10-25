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
    this.newUser.is_active ? true: this.newUser.is_active = false;
    this.newUser.type_user ? true: this.newUser.type_user = false;
    /* Creamos identificador para el nuevo usuario */
    let id = new Number(0);

    this._usersService.getLastID().subscribe(idObtained => {
      let id = new Number(idObtained);
      this.newUser.id = id.valueOf();
      console.log(id);      
    });

    this._usersService.postUser(this.newUser).subscribe(user => {
      if(user) {
        this._router.navigateByUrl('/users');
      }
    })
  }

}
