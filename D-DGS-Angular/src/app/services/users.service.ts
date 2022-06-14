import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseURL: string = "http://localhost:3000/users";

  constructor(private _httpClient: HttpClient) { }

  isAnAdmin(domainKey: string)
  {
    return this._httpClient.get(this.baseURL+"/isAdmin/"+domainKey)
  }

  getUsers() {
    return this._httpClient.get(this.baseURL);
  }

  getUserByID(id: string)
  {
    return this._httpClient.get(this.baseURL+"/"+id);
  }

  getUserDomain_Key(nickname: String, password: String)
  {
    return this._httpClient.get(this.baseURL+"/"+nickname+"/"+password);
  }

  updateUser(user: User)
  {
    return this._httpClient.put(this.baseURL+"/"+user._id, user);
  }

  deleteUser(id: string)
  {
    return this._httpClient.delete(this.baseURL+"/"+id);
  }

  postUser(userToPost: User) {
    return this._httpClient.post(this.baseURL, userToPost);
  }
}
