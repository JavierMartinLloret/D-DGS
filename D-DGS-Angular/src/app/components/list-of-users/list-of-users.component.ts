import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-list-of-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.scss']
})
export class ListOfUsersComponent implements OnInit {

  public hardcodedUsers: any = [{
    id: 1,
    nickname: 'pacoTabaco',
    email: 'pacotabaco@gmail.com',
    password: '1234',
    is_active: true,
    type_user: true
  },
  {
    id: 2,
    nickname: 'jonnyMelavo',
    email: 'jonnymelavo@gmail.com',
    password: '1234',
    is_active: true,
    type_user: true
  },
  {
    id: 3,
    nickname: 'elenaNito',
    email: 'elenanito@gmail.com',
    password: '1234',
    is_active: true,
    type_user: true
  },]

  constructor(private _userService: UsersService) { }

  ngOnInit(): void {
    this._userService.getUsers().subscribe(users => {
      console.log('List of users', users);
    })
  }

}
