import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  public updatedDataUser: User = new User;

  constructor(private _usersService: UsersService,
    private _router: Router) {}

  ngOnInit(): void {
    if(sessionStorage.getItem(LOG_TOKEN) == null || sessionStorage.getItem(LOG_TOKEN) == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    }
  }
  
}
