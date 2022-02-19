import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from "../../services/users.service";

const logToken: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public inputNick: String = new String();
  public inputPass : String = new String();
  

  // Flags
  public autenticationFailed: boolean = false;

  constructor(private _userService: UsersService, private _router: Router) {
    if(sessionStorage.getItem(logToken) == "FAILED")
      this.autenticationFailed = true;
  }

  ngOnInit(): void {
    console.log(sessionStorage.getItem(logToken));
    
  }

  /*  if user is registered, a token will be added to SessionStorage allowin him to navigate */
  loggin()
  {
    this._userService.getUserDomainIdentificator(this.inputNick, this.inputPass).subscribe((domainKey: any) => {
      sessionStorage.setItem(logToken, domainKey);
      window.location.reload();
    })
  }  

}
