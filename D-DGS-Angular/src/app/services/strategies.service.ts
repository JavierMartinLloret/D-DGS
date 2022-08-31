import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Strategy } from '../models/strategy';


@Injectable({
  providedIn: 'root'
})
export class StrategiesService {

  constructor(private _httpClient: HttpClient) { }

  /* STRATEGIES */
  private strategiesURL: string = "http://localhost:3000/strategies";

  getAllStrategies() {
    return this._httpClient.get(this.strategiesURL);
  }

  getASpecificStrategy(id: string)
  {
    return this._httpClient.get(this.strategiesURL+"/"+id)
  }

  getAllStrategiesFromAnSpecificUser(domain_key: string) {
    return this._httpClient.get(this.strategiesURL +"/fromAUser/"+domain_key)
  }

  postANewStrategy(s: Strategy) {
    return this._httpClient.post(this.strategiesURL, s);
  }

  updateAStrategy(s: Strategy)
  {
    return this._httpClient.put(this.strategiesURL, s);
  }

  deleteAnStrategy(ID: string) {
    return this._httpClient.delete(this.strategiesURL+"/"+ID);
  }
}
