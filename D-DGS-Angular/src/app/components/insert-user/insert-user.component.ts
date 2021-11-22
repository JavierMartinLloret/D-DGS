import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-insert-user',
  templateUrl: './insert-user.component.html',
  styleUrls: ['./insert-user.component.css']
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
    this._usersService.getLastID().subscribe(id => {
      let val = new Number(id).valueOf()+1;
      this.newUser.id = val;
      this._usersService.postUser(this.newUser).subscribe(user => {
        if(user) {
          this._router.navigateByUrl('/users');
        }
      })
      
    })
  }

}
