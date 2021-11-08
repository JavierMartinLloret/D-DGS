import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public userID: number = -1;
  public user: any = new User(); // any type because the return value comes this way

  public updatedDataUser: User = new User;

  constructor(private _usersService: UsersService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userID = this.route.snapshot.params['id'];
    this._usersService.getUser(this.userID).subscribe(user => {
      this.user = user;
    })
  }
  
  modifyUser()
  {
    //updatedDataUser llega con todos los campos vacíos a menos que explícitamente se hayan modificado en el formulario
    
    
  }
}
