import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseURL: string = "http://localhost:3000/users"; //URL de la API con la BD Mongo

  private lastIDURL: string = "http://localhost:3000/lastID";

  constructor(private _httpClient: HttpClient) { }

  getUsers() {
    return this._httpClient.get(this.baseURL);
  }

  getUser(id: number)
  {
    return this._httpClient.get(this.baseURL+"/"+id);
  }

  putUser(id: number, user: User)
  {
    return this._httpClient.put(this.baseURL+"/"+id, user);
  }

  getLastID(){
    return this._httpClient.get(this.lastIDURL);
  }

  postUser(userToPost: User) {
    return this._httpClient.post(this.baseURL, userToPost);
  }
}
