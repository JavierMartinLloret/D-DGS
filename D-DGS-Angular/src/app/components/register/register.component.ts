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

  constructor(private _router: Router, private _userService: UsersService, private _diagramDomainService: DiagramDomainService) { }

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
      this._diagramDomainService.postANewContext(new Context(DEFAULT_CONTEXT_NAME, this.userToCreate.domainIdentificator)).subscribe(res => {
        this._diagramDomainService.postANewRewardSet(new Reward_Set(DEFAULT_SET_NAME, this.userToCreate.domainIdentificator)).subscribe(res => {
          this._router.navigateByUrl('/login');
        })
      })
    })
  }

}
