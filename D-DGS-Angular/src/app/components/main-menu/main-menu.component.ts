import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO



@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  
  // Domain_Key
  public DOMAIN_KEY: string="";

  // Flags
  public userIsAdmin: boolean = false;

  constructor(private _router: Router, private _usersService: UsersService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(sessionStorage.getItem(LOG_TOKEN) == null || sessionStorage.getItem(LOG_TOKEN) == "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    } 
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._usersService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      })
    }
  }

  ngOnInit(): void {
      
  }

  goToDomainCreation()
  {}
  goToRewardCreation()
  {}
  goToDiagramDesing()
  {}
  goToDiagramArchive()
  {}
  goToListOfUsers()
  {}
  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN)
  }
  logOut()
  {
    sessionStorage.removeItem(LOG_TOKEN);
  }

}
