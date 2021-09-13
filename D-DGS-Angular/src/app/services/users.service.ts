import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseURL: string = "http://localhost:3000/users";

  constructor(private _httpClient: HttpClient) { }

  getUsers() {
    return this._httpClient.get(this.baseURL);
  }

  postUser(userToCreate: User)
  {
    return this._httpClient.post(this.baseURL, userToCreate);
  }
}
