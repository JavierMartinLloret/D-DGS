import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public userID: number = -1;
  public user: any = new User(); // any type because the return value comes this way

  public updatedDataUser: User = new User;

  constructor(private _usersService: UsersService,
    private _route: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {
    this.userID = this._route.snapshot.params['id'];
    this._usersService.getUser(this.userID).subscribe(user => {
      this.user = user;
    })
  }
  
  modifyUser()
  {
    // updatedDataUser llega con todos los campos vacíos a menos que explícitamente se hayan modificado en el formulario
    // Los booleanos hay que inicializarlos o no podemos poner en false los atributos
    if(this.updatedDataUser.is_active == undefined)
      this.updatedDataUser.is_active = false;
    if(this.updatedDataUser.type_user == undefined)
      this.updatedDataUser.type_user = false;
    
    this._usersService.putUser(this.userID, this.updatedDataUser).subscribe(newUser => {
      if(newUser)
        this._router.navigateByUrl('/users');
    })    
  }

  deleteUser()
  {
    this._usersService.deleteUser(this.userID).subscribe(newUser => {
      if(newUser)
        this._router.navigateByUrl('/users');
    })
  }
}
