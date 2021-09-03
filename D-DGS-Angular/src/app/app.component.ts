import { Component } from '@angular/core';

import { User } from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userArrayExample: User[] = [
    {id: 1, nickname: "Paco", email: "pacotabaco@gmail.com",
    password: "SuperSecurePassword1", is_active: true, type_user: true},
    {id: 2, nickname: "John", email: "jhonsalchichon@gmail.com",
    password: "SuperSecurePassword2", is_active: true, type_user: true},
    {id: 3, nickname: "Elenea", email: "elenanitodelbosque@gmail.com",
    password: "SuperSecurePassword3", is_active: true, type_user: true}
  ];

  selectedUser: User = new User();

  openForEdit(userFromTheList: User)
  {
    this.selectedUser = userFromTheList;
  }

  addOrEdit()
  {
    if(this.selectedUser.id == undefined)
    {
      this.selectedUser.id = this.userArrayExample.length + 1;
      this.userArrayExample.push(this.selectedUser);
    }
    this.selectedUser = new User();
  }

  delete() {
    if(confirm('Are you sure?'))
    {
      this.userArrayExample = this.userArrayExample.filter(x => x != this.selectedUser);
      this.selectedUser = new User();
    }
  }

}
