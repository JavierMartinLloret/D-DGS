import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileRelatedService {

  constructor(private _httpClient: HttpClient) { }

  private diagramURL: string = "http://localhost:3000/downloads"

  getAJSONDiagram(diagramID: string) {
     return this._httpClient.get(this.diagramURL+"/diagrams/"+diagramID);
  }
}