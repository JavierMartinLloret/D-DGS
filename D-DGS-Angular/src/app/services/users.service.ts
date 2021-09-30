import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseURL: string = "http://localhost:3000/users";

  constructor(private _httpClient: HttpClient) { }

  getUsers() {
    return this._httpClient.get(this.baseURL);
  }
}
