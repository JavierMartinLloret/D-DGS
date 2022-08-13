import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Context } from 'src/app/models/context';
import { Reward_Set } from 'src/app/models/reward_set';
import { User } from 'src/app/models/user';
import { DiagramDomainService } from 'src/app/services/diagramDomain.service';
import { UsersService } from 'src/app/services/users.service';

const DEFAULT_CONTEXT_NAME: string = "Default Context";
const DEFAULT_SET_NAME: string = "Default Reward Set";
const LOG_TOKEN: string = "LOG_TOKEN";
// LOG_TOKEN: null | FAILED | identificador del dominio del usuario
// * DEBE SUSTITUIRSE EN ALGÚN MOMENTO POR ALGO CIFRADO

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public DOMAIN_KEY: string="";
  public userIsAdmin: boolean = false;
  public userToCreate: User = new User("","","","",false);

  constructor(private _router: Router, private _userService: UsersService, private _diagramDomainService: DiagramDomainService) {
    let aux = sessionStorage.getItem(LOG_TOKEN);
    if(aux)
    {
      this.DOMAIN_KEY = aux;
      this._userService.isAnAdmin(this.DOMAIN_KEY).subscribe(res => {
        if(res)
          this.userIsAdmin = true;
      })
    }
  }

  ngOnInit(): void {
    if(sessionStorage.getItem(LOG_TOKEN) != null && sessionStorage.getItem(LOG_TOKEN) != "FAILED")
    {
      sessionStorage.removeItem(LOG_TOKEN);  
      this._router.navigateByUrl('/login');
    } 
  }

  registerUser() { 
    this.userToCreate.domain_key = this.userToCreate.nickname+"IDENTIFICATOR";
    this.userToCreate.is_admin = false;
        
    this._userService.postUser(this.userToCreate).subscribe((state: any) => {
      this._diagramDomainService.postANewContext(new Context(DEFAULT_CONTEXT_NAME, this.userToCreate.domain_key)).subscribe(res => {
        this._diagramDomainService.postANewRewardSet(new Reward_Set(DEFAULT_SET_NAME, this.userToCreate.domain_key)).subscribe(res => {
          this._router.navigateByUrl('/login');
        })
      })
    })
  }

  unlogUser()
  {
    sessionStorage.removeItem(LOG_TOKEN);
  }

}
