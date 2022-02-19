import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-insert-user',
  templateUrl: './insert-user.component.html',
  styleUrls: ['./insert-user.component.css']
})
export class InsertUserComponent implements OnInit {

  public newUser: User = new User();

  constructor(private _usersService: UsersService,
              private _router: Router) { }

  ngOnInit(): void {
  }

}
