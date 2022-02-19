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


  public updatedDataUser: User = new User;

  constructor(private _usersService: UsersService,
    private _route: ActivatedRoute,
    private _router: Router) {}

  ngOnInit(): void {  }
  
}
