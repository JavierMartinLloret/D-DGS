import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public editedUserID: number = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // /edit_user/ === position 11
    this.editedUserID = parseInt(this.router.url.substring(11, this.router.url.length));
    console.log(this.editedUserID);
  }

  editUserData()
  {
    // Modificar de la BD el usuario cuyo id == this.editedUserID
  }

}
