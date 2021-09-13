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

  public userInInterface: User = new User();

  constructor(private _usersService: UsersService,
              private _router: Router) { }

  ngOnInit(): void {
  }

  insertUser(){
    console.log('Printing User', this.userInInterface);
    this._usersService.postUser(this.userInInterface).subscribe(user =>{
      if(user)
      {
        this._router.navigateByUrl('/users');
      }
    })
  }

}
