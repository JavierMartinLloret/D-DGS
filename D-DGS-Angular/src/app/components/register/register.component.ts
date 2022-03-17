import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _router: Router, private _userService: UsersService) { }

  public userToCreate: User = new User("","","","",false);

  ngOnInit(): void {
    if(sessionStorage.getItem(LOG_TOKEN) != null && sessionStorage.getItem(LOG_TOKEN) != "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    } 
  }

  registerUser() {
    /*HAY QUE CREAR UN IDENTIFICADOR DE DOMINIO PARA EL NUEVO USUARIO REGISTRADO 
      A SER POSIBLE CON ALGO QUE NO SEA ESTA BASURILLA */    
    this.userToCreate.domainIdentificator = this.userToCreate.nickname+"IDENTIFICATOR";
        
    this._userService.postUser(this.userToCreate).subscribe((state: any) => {
      this._router.navigateByUrl('/login');
    })
  }

}
